import { ActivityType, Client } from 'discord.js';
import { Event } from '../../Structures/Interfaces/Event.js';
import { updateStatusDB } from '../../Structures/Functions/Commands/status.commands.js';

const { Watching } = ActivityType;

const event: Event = {
    name: 'ready',
    options: {
        ONCE: true,

    },

    execute: async (client: Client) => {
        client.user?.setPresence({
            activities: [
                {
                    name: `github.com/AmitKumarHQ`,
                    type: Watching,
                },

            ],
            status: 'online',

        });

		const MemoryArr: any[] = [];
        await updateStatusDB(MemoryArr);

    },

};

export default event;
