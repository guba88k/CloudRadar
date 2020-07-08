// Author: Carlos Vasili (@cvasilivg) - VasikokK

// Require express, body-parser and discord
const express = require("express"); // npm install express
const bodyParser = require("body-parser"); // npm install body-parser
const Discord = require('discord.js'); // npm install discord.js

// Initialize express and define a port
const app = express();
const PORT = 3000;

// Discord WebHook
//https://discordapp.com/api/webhooks/id/token
const client = new Discord.Client();
const webhookClient = new Discord.WebhookClient('id', 'token');

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json());

// Start express on the defined port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//...
app.use(bodyParser.json());

app.post("/hook", (req, res) => { // http|s://ip:3000/hook
    let result = req.body;

    console.log(result) // Call your action on the request here (JSON from CloudRadar.io)

    let uuid = result['uuid'];
    let timestamp = result['timestamp'];
    let team = result['team'];
    let timezone = result['timezone'];
    let trigger_uuid = result['trigger_uuid'];
    let trigger_name = result['trigger_name'];
    let trigger_severity = result['trigger_severity'];
    let check_uuid = result['check_uuid'];
    let check_name = result['check_name'];
    let check_last_value = result['check_last_value'];
    let host_uuid = result['host_uuid'];
    let host_name = result['host_name'];
    let host_connect = result['host_connect'];
    let host_description = result['host_description'];
    let host_location = result['host_location'];
    let messagetype = result['messagetype'];
    let total_alerts = result['total_alerts'];
    let total_warnings = result['total_warnings'];
    let total_hosts = result['total_hosts'];
    let check_last_timestamp = result['check_last_timestamp'];
    let show_general_overview = result['show_general_overview'];

    let color_alerts = [16711680, 65280, 15258703]; // Red, Green, Yellow

    const sendAlertToWebhook = function(color_decimal) {
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
                    url: 'url_server_status_page_cloudradar',
                    description: host_description,
                    color: color_decimal,
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
                            name: 'Host UUID',
                            value: host_uuid,
                            inline: true,
                        },
                        {
                            name: 'Server Alerts Location',
                            value: host_location,
                            inline: true,
                        },
                        {
                            name: 'UUID',
                            value: uuid,
                            inline: true,
                        },
                        {
                            name: 'Timestamp',
                            value: timestamp,
                            inline: true,
                        },
                        {
                            name: 'Team',
                            value: team,
                            inline: true,
                        },
                        {
                            name: 'Timezone',
                            value: timezone,
                            inline: true,
                        },
                        {
                            name: 'Trigger UUID',
                            value: trigger_uuid,
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
                            name: 'Check UUID',
                            value: check_uuid,
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
                        },
                        {
                            name: 'Check Last Timestamp',
                            value: check_last_timestamp,
                            inline: true,
                        },
                        {
                            name: 'Show General Overview',
                            value: show_general_overview,
                            inline: true,
                        }
                    ],
                },
            ]
        });
    };

    if (messagetype === 'problem') {
        sendAlertToWebhook(color_alerts[0]);
    } else if(messagetype === 'recovery') {
        sendAlertToWebhook(color_alerts[1]);
    } else {
        sendAlertToWebhook(color_alerts[2]);
    }

    res.status(200).end(); // Responding is important
});
//...
