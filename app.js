/**
 * Author: Carlos Vasili (@cvasilivg)
 * Program: Send alerts from CloudRadar.io to Discord with webhook
 */

// Require express, body-parser and discord.js
// npm i express body-parser discord.js
const express = require('express');
const bodyParser = require('body-parser');
const discord = require('discord.js');

// Initialize express and define a port
const app = express();
app.set('port', process.env.PORT || 4000);

// Initialize discord with our webhook
// https://discordapp.com/api/webhooks/id/token
const client = new discord.Client();
const webhookClient = new discord.WebhookClient('1011908640619376680', 'MTAxMTkwODY0MDYxOTM3NjY4MA.G1NO2D.MyGFH_sC2UgvZQw9A_bS4k4W-xqR3kYIMV2e-g');

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json());

// Main Program
app.get('/', (request, response) => {
    response.status(200).end();
});

app.post('/api/webhook', (request, response) => {
    let { messagetype, host_description, host_name, host_connect, trigger_name, trigger_severity, check_name, check_last_value, total_alerts, total_warnings, total_hosts } = request.body;
    let colorAlerts = [16711680, 65280, 15258703]; // Red, Green, Yellow

    const sendAlertToWebhook = function(colorDecimal) {
        webhookClient.send({
            content: '@everyone',
            embeds: [
                {
                    author: {
                        name: 'CloudRadar',
                        url: 'https://www.cloudradar.io/',
                        icon_url: 'https://assets.website-files.com/5b5c51e6e90d48569fa226af/5de0cb3dd41c9b7545b5d3ae_Ico_CloudRadar_32x32.png',
                    },
                    title: messagetype,
                    url: 'https://serverstate.info/',
                    description: host_description,
                    color: colorDecimal,
                    fields: [
                        {
                            name: 'Host Name',
                            value: host_name,
                            inline: true,
                        },
                        {
                            name: 'Host Connect',
                            value: host_connect,
                            inline: true,
                        },
                        {
                            name: 'Trigger Name',
                            value: trigger_name,
                            inline: true,
                        },
                        {
                            name: 'Trigger Severity',
                            value: trigger_severity,
                            inline: true,
                        },
                        {
                            name: 'Check Name',
                            value: check_name,
                            inline: true,
                        },
                        {
                            name: 'Check Last Value',
                            value: check_last_value,
                            inline: true,
                        },
                        {
                            name: 'Total Alerts',
                            value: total_alerts,
                            inline: true,
                        },
                        {
                            name: 'Total Warnings',
                            value: total_warnings,
                            inline: true,
                        },
                        {
                            name: 'Total Hosts',
                            value: total_hosts,
                            inline: true,
                        }
                    ],
                },
            ]
        });
    };

    if (messagetype === 'problem') {
        sendAlertToWebhook(colorAlerts[0]);
    } else if (messagetype === 'recovery') {
        sendAlertToWebhook(colorAlerts[1]);
    } else {
        sendAlertToWebhook(colorAlerts[2]);
    }

    // Responding
    response.status(200).end();
});
// End Main Program

// Start Server
app.listen(app.get('port'), () => {
    console.log(`Running on port ${app.get('port')}`);
});
