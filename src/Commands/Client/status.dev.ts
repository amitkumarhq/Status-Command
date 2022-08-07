import { AttachmentBuilder, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { BaseClient } from '../../Structures/Classes/Client';
import { icon } from '../../Structures/Design/index.js';
import { Command } from '../../Structures/Interfaces';

import { ChartConfiguration, ChartData } from 'chart.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import gradient from 'chartjs-plugin-gradient';

import DB from '../../Structures/Schemas/ClientDB.js';
import mongoose from 'mongoose';

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Bot Status Information')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    execute: async (interaction: ChatInputCommandInteraction, client: BaseClient) => {
        const docs = await DB.findOne({ Client: true });

        /**Graph Colors */
        const colors = {
            purple: {
                zero: 'rgba(149, 76, 233, 0)',
                low: 'rgba(149, 76, 233, 0.1)',
                quarter: 'rgba(149, 76, 233, 0.25)',
                half: 'rgba(149, 76, 233, 0.5)',
                default: 'rgba(149, 76, 233, 1)',

            }, indigo: {
                zero: 'rgba(80, 102, 120, 0)',
                low: 'rgba(80, 102, 120, 0.1)',
                quarter: 'rgba(80, 102, 120, 0.25)',
                half: 'rgba(80, 102, 120, 0.5)',
                default: 'rgba(80, 102, 120, 1)',

            }, green: {
                zero: 'rgba(92, 221, 139, 0)',
                low: 'rgba(92, 221, 139, 0.1)',
                quarter: 'rgba(92, 221, 139, 0.25)',
                half: 'rgba(92, 221, 139, 0.5)',
                default: 'rgba(92, 221, 139, 1)',

            },

        };

        /** Change according to the setInterval() in [ready.ts](../../Events/Client/ready.ts) */
        const labels = ['60', '55', '50', '45', '40', '35', '30', '25', '20', '15', '10', '5'];

        const Memory = docs!.Memory;
        const AvgMem = Memory.reduce((a, b) => a + Math.floor(b), 0) / Memory.length;

        /** Canvas generation */
        const canvas = new ChartJSNodeCanvas({
            width: 1500,
            height: 720,
            plugins: {
                modern: [gradient],
            },
            chartCallback: (ChartJS) => { },
        });

        /** Chart Data */
        const chartData: ChartData = {
            labels: labels,
            datasets: [
                {
                    label: 'RAM Usage',
                    fill: true,
                    gradient: {
                        backgroundColor: {
                            axis: 'y',
                            colors: {
                                0: colors.green.zero,
                                100: colors.green.quarter,
                            },
                        },
                    },
                    pointBackgroundColor: colors.green.default,
                    borderColor: colors.green.default,
                    data: Memory,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 3,

                },
            ],
        };

        /** Chart Configuration */
        const ChartConfig: ChartConfiguration = {
            type: 'line',
            data: chartData,
            options: {
                layout: {
                    padding: 10,

                },
                responsive: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'RAM Usage',
                        align: 'center',
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: {
                            family: "'Raleway', sans-serif",
                            size: 18,

                        },

                    },
                    legend: {
                        display: false,
                        position: 'top',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            font: {
                                family: 'Raleway',
                                style: 'normal',
                                weight: '500',
                                size: 18,

                            },

                        }

                    },

                },
                scales: {
                    xAxes: {
                        gridLines: {
                            display: false,

                        }, ticks: {
                            // @ts-ignore
                            autoSkip: false,
                            padding: 10,
                            maxRotation: 0,
                            minRotation: 0,
                            font: {
                                family: 'Raleway',
                                size: 18,

                            },

                        },

                    },
                    yAxes: {
                        scaleLabel: {
                            display: true,
                            labelString: 'Usage',
                            padding: 10,

                        }, gridLines: {
                            display: true,
                            color: colors.indigo.quarter,

                        }, ticks: {
                            // @ts-ignore
                            beginAtZero: false,
                            max: 63,
                            min: 57,
                            padding: 10,
                            font: {
                                family: 'Raleway',
                                size: 14,

                            },

                        },

                    },

                },

            },
            plugins: [
                {
                    id: 'mainBg',
                    beforeDraw: (chart) => {
                        const ctx = chart.canvas.getContext('2d');
                        ctx.save();
                        ctx.globalCompositeOperation = 'destination-over';
                        ctx.fillStyle = '#192027';
                        ctx.fillRect(0, 0, chart.width, chart.height);
                        ctx.restore();

                    },

                },

            ],

        };

        const image = await canvas.renderToBuffer(ChartConfig);
        const attachment = new AttachmentBuilder(image, {
            name: 'chart.png',
            description: 'Client statistics chart',
        });

        if (!docs || Memory.length < 12) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('🛑 No Data Found!')
                        .setDescription('Please wait for the information to collect!'),
                ],
                ephemeral: true,
            });
        }

        const response = new EmbedBuilder()
            .setColor('Green')
            .setTitle('Client Status')
            .addFields({
                name: `${icon.reply.default} GENERAL`,
                value: `**\`•\` Client**: ${icon.color.green} ONLINE \n**\`•\` Ping**: ${client.ws.ping}ms \n**\`•\` Uptime**: <t:${parseInt(`${client.readyTimestamp! / 1000}`)}:R> \nㅤ`,
                inline: false,

            }, {
                name: `${icon.reply.default} DATABASE`,
                value: `**\`•\` Connection**: ${dbStatus(mongoose.connection.readyState)}\nㅤ`,
                inline: true,

            }, {
                name: `${icon.reply.default} HARDWARE`,
                value: `**\`•\` Average RAM Usage**: ${AvgMem.toFixed(1)}%`,
                inline: false,

            })
            .setImage('attachment://chart.png');

        await interaction.deferReply();
        await interaction.editReply({
            embeds: [response],
            files: [attachment],
        });
    },
};

function dbStatus(val: number) {
    let status = '';
    switch (val) {
        case 0: { status = `${icon.color.red} DISCONNECTED` } break;
        case 1: { status = `${icon.color.green} CONNECTED` } break;
        case 2: { status = `${icon.color.yellow} CONNECTING` } break;
        case 3: { status = `${icon.color.blue} DISCONNECTING` } break;

    } return status;
}

export default command;
