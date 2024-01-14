const express = require('express');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const zapier = require('zapier-platform-core');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
// Set up session management
app.use(session({
    secret: process.env.SECRETKEY,
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
})
);

app.use(cors());
// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL = 'http://localhost:5000/auth/google/callback';

const users = [];
const usageData = {
    "storage": 100,
    "bandwidth":500
};



passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: CALLBACK_URL,
        },
        (accessToken, refreshToken, profile, done) => {
            const user = { id: profile.id, displayName: profile.displayName , email: profile._json.email};
            users.push(user);
            return done(null, user);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.find((u) => u.id === id);
    done(null, user);
});

app.get('/', (req, res) => {
    res.send('hello world');
});

// Google OAuth routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
    res.redirect('http://localhost:3000/dashboard');
    }
);


// Usage details
app.get('/usage-details', isAuthenticated, (req, res) => {
    const user = req.user;
    let username = req.user.displayName;
    let email = req.user.email;
    const userUsage = usageData ;
    res.json({ username,email, userUsage });
});

// Billing information
app.get('/billing-information', isAuthenticated, (req, res) => {
    const user = req.user;
    const userUsage = usageData || {};
    const billingDetails = calculateBilling(userUsage);
    res.json(billingDetails);
});

// Invoice generation
app.get('/generate-invoice', isAuthenticated, (req, res) => {
    // Generate an invoice based on cumulative usage
    const user = req.user;
    const userUsage = usageData || {};
    const invoice = generateInvoice(userUsage);
    res.json(invoice);
});

// Endpoint to handle Zapier webhook
app.post('/zapier-webhook', (req, res) => {
    const dataFromZapier = req.body;

    // Assuming the data structure from Zapier includes user id and usage metrics
    const userId = dataFromZapier.userId;
    const usageMetrics = dataFromZapier.usageMetrics;

    // Retrieve user from your data storage (e.g., usageData)
    const user = users.find((u) => u.id === userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    // Update user's usage data
    usageData = usageMetrics;

    // Trigger billing actions based on the updated usage data
    const billingDetails = calculateBilling(usageMetrics);

    // Example: If usage exceeds a certain threshold, generate an invoice
    if (billingDetails.shouldGenerateInvoice) {
        const invoice = generateInvoice(usageMetrics);
        // Add logic to send the invoice or perform other billing actions
        console.log('Generated Invoice:', invoice);
    }
    // Respond to Zapier with a success message
    res.status(200).json({ message: 'Webhook received successfully' });
});

//logout
app.post('/auth/logout',(req, res) => {
req.session.destroy();
    res.redirect('/');
});

//Middlware API
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }else {
    // User is not authenticated, send a response
    res.status(401).json({ error: 'Unauthorized' });
}
    res.redirect('/');
}

function calculateBilling(usage) {

    const storageRate = 0.05; 
    const bandwidthRate = 0.1; 
    const storageCost = usage.storage * storageRate;
    const bandwidthCost = usage.bandwidth * bandwidthRate;
    const totalCost = storageCost + bandwidthCost; 

    const formattedBilling = {
        currentCycle: 'Month 1',
        cumulativeUsage: usage,
        costs: {
            storage: storageCost,
            bandwidth: bandwidthCost,
        },
        totalCost: totalCost,
    };

    return formattedBilling;
}


function generateInvoice(usage) {
    return { invoiceNumber: 'INV001', invoiceDate: new Date(), usage };
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));