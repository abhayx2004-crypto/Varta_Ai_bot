const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Groq = require('groq-sdk');
const path = require('path');
require('dotenv').config();

const config = require('./config');
const Visitor = require('./models/Visitor');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

const app = express();
const PORT = process.env.PORT || 5000;


// =====================================================
// SECURITY & MIDDLEWARE
// =====================================================

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    frameguard: false
  })
);

app.use(cors());

app.use(express.json());


// =====================================================
// RATE LIMITING
// =====================================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

app.use('/api/', apiLimiter);


// =====================================================
// SERVE WIDGET.JS
// =====================================================

app.use(express.static(path.join(__dirname, 'public')));


// =====================================================
// GROQ AI
// =====================================================

const groqApiKey = process.env.GROQ_API_KEY;

if (!groqApiKey) {
  console.warn(
    'WARNING: GROQ_API_KEY is not defined in the environment.'
  );
}

const groq = new Groq({
  apiKey: groqApiKey || 'placeholder_key'
});


// =====================================================
// MONGODB
// =====================================================

const mongoUri =
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/varta_assistant';

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((err) => {
    console.error(
      'MongoDB connection failure:',
      err
    );
  });


// =====================================================
// WIDGET - ONBOARD VISITOR
// =====================================================

app.post('/api/widget/onboard', async (req, res) => {

  const {
    name,
    profession,
    goal
  } = req.body;

  console.log(
    `[WIDGET] Onboarding visitor: ${name}`
  );

  try {

    if (!name || !profession || !goal) {

      return res.status(400).json({
        error:
          'Name, profession, and goal are all required.'
      });

    }

    // Create visitor
    const newVisitor = new Visitor({
      name,
      profession,
      goal
    });

    const savedVisitor =
      await newVisitor.save();


    // Create conversation
    const newConversation =
      new Conversation({
        visitorId: savedVisitor._id
      });

    const savedConversation =
      await newConversation.save();


    console.log(
      `[WIDGET] Visitor created: ${savedVisitor._id}`
    );

    console.log(
      `[WIDGET] Conversation created: ${savedConversation._id}`
    );


    return res.status(201).json({

      message:
        'Onboarding completed successfully.',

      visitorId:
        savedVisitor._id,

      conversationId:
        savedConversation._id,

      visitorName:
        savedVisitor.name

    });

  } catch (error) {

    console.error(
      '[WIDGET] Onboarding error:',
      error
    );

    return res.status(500).json({
      error:
        'Failed to complete visitor onboarding.'
    });

  }

});


// =====================================================
// WIDGET - CHAT HISTORY
// =====================================================

app.get(
  '/api/widget/history/:visitorId',
  async (req, res) => {

    const {
      visitorId
    } = req.params;


    try {

      if (
        !mongoose.Types.ObjectId.isValid(
          visitorId
        )
      ) {

        return res.status(400).json({
          error:
            'Invalid visitor ID.'
        });

      }


      const visitor =
        await Visitor.findById(visitorId);


      if (!visitor) {

        return res.status(404).json({
          error:
            'Visitor not found.'
        });

      }


      const conversation =
        await Conversation
          .findOne({ visitorId })
          .sort({ createdAt: -1 });


      if (!conversation) {

        return res.status(200).json({

          visitorName:
            visitor.name,

          conversationId:
            null,

          messages: []

        });

      }


      const messages =
        await Message
          .find({
            conversationId:
              conversation._id
          })
          .sort({
            createdAt: 1
          });


      return res.status(200).json({

        visitorName:
          visitor.name,

        conversationId:
          conversation._id,

        messages:
          messages.map((msg) => ({

            sender:
              msg.sender,

            text:
              msg.text,

            createdAt:
              msg.createdAt

          }))

      });


    } catch (error) {

      console.error(
        '[WIDGET] History error:',
        error
      );

      return res.status(500).json({
        error:
          'Failed to retrieve conversation history.'
      });

    }

  }
);


// =====================================================
// WIDGET - CHAT
// =====================================================

app.post(
  '/api/widget/chat',
  async (req, res) => {

    const {
      visitorId,
      conversationId,
      text
    } = req.body;


    console.log(
      '\n========== CHAT START =========='
    );

    console.log(
      `[WIDGET] Visitor: ${visitorId}`
    );

    console.log(
      `[WIDGET] Message: ${text}`
    );


    try {

      // -------------------------------------------------
      // Validate request
      // -------------------------------------------------

      if (
        !visitorId ||
        !conversationId ||
        !text
      ) {

        return res.status(400).json({
          error:
            'visitorId, conversationId, and text are required.'
        });

      }


      // -------------------------------------------------
      // Validate IDs
      // -------------------------------------------------

      if (
        !mongoose.Types.ObjectId.isValid(
          visitorId
        ) ||
        !mongoose.Types.ObjectId.isValid(
          conversationId
        )
      ) {

        return res.status(400).json({
          error:
            'Invalid visitor or conversation ID.'
        });

      }


      // -------------------------------------------------
      // Find visitor
      // -------------------------------------------------

      const visitor =
        await Visitor.findById(
          visitorId
        );


      if (!visitor) {

        return res.status(404).json({
          error:
            'Visitor profile not found.'
        });

      }


      console.log(
        `[WIDGET] User: ${visitor.name}`
      );

      console.log(
        `[WIDGET] Profession: ${visitor.profession}`
      );

      console.log(
        `[WIDGET] Goal: ${visitor.goal}`
      );


      // -------------------------------------------------
      // Save visitor message
      // -------------------------------------------------

      const visitorMessage =
        new Message({

          conversationId,

          sender:
            'visitor',

          text

        });


      await visitorMessage.save();


      // -------------------------------------------------
      // Get previous messages
      // -------------------------------------------------

      const pastMessages =
        await Message
          .find({
            conversationId
          })
          .sort({
            createdAt: 1
          })
          .limit(20);


      // -------------------------------------------------
      // Format messages for Groq
      // -------------------------------------------------

      const formattedChatHistory =
        pastMessages.map((msg) => ({

          role:
            msg.sender === 'visitor'
              ? 'user'
              : 'assistant',

          content:
            msg.text

        }));


      // -------------------------------------------------
      // Visitor context
      // -------------------------------------------------

      const visitorContext = `

VISITOR PROFILE:

Name:
${visitor.name}

Profession:
${visitor.profession}

Goal:
${visitor.goal}

Use this information to personalize your answers when relevant.
`;


      // -------------------------------------------------
      // System instructions
      // -------------------------------------------------

      const fullSystemInstructions = `

${config.SYSTEM_PROMPT}

${visitorContext}

You are the AI assistant for EventEase.

Help visitors discover and understand events available
on the EventEase website.

You can answer questions about:

- Events
- Event categories
- Dates
- Times
- Locations
- Event descriptions
- Technology events
- Business events
- Creative events
- Music events

Keep responses helpful, friendly and concise.

If the user asks about something unrelated to EventEase,
politely explain that you are the EventEase AI assistant.

`;


      // -------------------------------------------------
      // Final prompt
      // -------------------------------------------------

      const promptMessages = [

        {
          role:
            'system',

          content:
            fullSystemInstructions

        },

        ...formattedChatHistory

      ];


      // -------------------------------------------------
      // Call Groq
      // -------------------------------------------------

      let aiReplyText =
        'I am having trouble connecting right now. Please try again soon.';


      if (groqApiKey) {

        try {

          console.log(
            `[WIDGET] Using Groq model: ${config.GROQ_MODEL}`
          );


          const completion =
            await groq.chat.completions.create({

              messages:
                promptMessages,

              model:
                config.GROQ_MODEL,

              temperature:
                0.7,

              max_tokens:
                1024

            });


          aiReplyText =
            completion
              .choices[0]
              .message
              .content;


        } catch (groqError) {

          console.error(
            '[WIDGET] Groq error:',
            groqError
          );


          aiReplyText =
            'I am temporarily unable to generate a response. Please try again.';

        }

      } else {

        aiReplyText =
          `[Demo Mode] Hi ${visitor.name}! Your message was received: "${text}"`;

      }


      // -------------------------------------------------
      // Save AI message
      // -------------------------------------------------

      const aiMessage =
        new Message({

          conversationId,

          sender:
            'ai',

          text:
            aiReplyText

        });


      await aiMessage.save();


      console.log(
        '[WIDGET] AI response saved.'
      );


      console.log(
        '========== CHAT END ==========\n'
      );


      return res.status(200).json({

        reply:
          aiReplyText

      });


    } catch (error) {

      console.error(
        '[WIDGET] Chat error:',
        error
      );


      return res.status(500).json({

        error:
          'Failed to process chat message.'

      });

    }

  }
);


// =====================================================
// EVENTEASE HOMEPAGE
// =====================================================

const eventEasePath =
  path.join(
    __dirname,
    '..',
    'index.html'
  );


app.get(
  '/',
  (req, res) => {

    res.sendFile(
      eventEasePath
    );

  }
);


// =====================================================
// REACT FRONTEND
// =====================================================

const frontendBuildPath =
  path.join(
    __dirname,
    '..',
    'frontend',
    'dist'
  );


app.use(
  express.static(
    frontendBuildPath
  )
);


// =====================================================
// CHATBOT FRAME
// =====================================================
//
// This is NOT a separate page for the user.
// widget.js loads this internally inside an iframe.
//

app.get(
  '/widget-frame',
  (req, res) => {

    res.sendFile(
      path.join(
        frontendBuildPath,
        'index.html'
      )
    );

  }
);


// =====================================================
// START SERVER
// =====================================================

app.listen(
  PORT,
  () => {

    console.log(
      '=============================================='
    );

    console.log(
      `EventEase + Contexta AI running on port ${PORT}`
    );

    console.log(
      `Website: http://localhost:${PORT}`
    );

    console.log(
      `Widget: http://localhost:${PORT}/widget.js`
    );

    console.log(
      '=============================================='
    );

  }
);