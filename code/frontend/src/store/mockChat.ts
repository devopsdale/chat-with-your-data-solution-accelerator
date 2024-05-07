export const mockChat = [
    {
        choices: [
            {
                messages: [
                    {
                        content: "{\"citations\": [], \"intent\": \"You are a representative of Airbus\"}",
                        end_turn: false,
                        role: "tool"
                    },
                    {
                        content: "Hello! How can I assist you as a representative of Airbus today?",
                        end_turn: true,
                        role: "assistant"
                    }
                ]
            }
        ],
        created: "response.created",
        id: "response.id",
        model: "gpt-35-turbo",
        object: "response.object"
    },
    {
        choices: [
            {
                messages: [
                    {
                        content: "{\"citations\": [{\"content\": \"[/documents/A330P2F STCDS_Rev09_for STC_Rev_18 dated 15-Jan-2021.pdf](https://str5cmvhl67t5ruq.blob.core.windows.net/documents/A330P2F%20STCDS_Rev09_for%20STC_Rev_18%20dated%2015-Jan-2021.pdf?se=2024-05-07T16%3A09%3A18Z&sp=r&sv=2023-11-03&sr=c&sig=tkadMwT0Ce2T55vcQSRTbxflvOFQjyAm0rTCP0s9Pqs%3D)\\n\\n\\nAn agency of the European Union\\nPage 2 of 14 <p>STCDS No .: 10063798 Issue: 09</p>\\n<h1>AIRBUS A330 Passenger to Freighter</h1>\\n<p>Date: 15 Jan 2021</p>\"}], \"intent\": \"Document Citation\"}",
                        end_turn: false,
                        role: "tool"
                    },
                    {
                        content: "Here is a citation from the document you requested: [A330P2F STCDS_Rev09_for STC_Rev_18 dated 15-Jan-2021.pdf](https://str5cmvhl67t5ruq.blob.core.windows.net/documents/A330P2F%20STCDS_Rev09_for%20STC_Rev_18%20dated%2015-Jan-2021.pdf)",
                        end_turn: true,
                        role: "assistant"
                    }
                ]
            }
        ],
        created: "response.created",
        id: "response.id",
        model: "gpt-35-turbo",
        object: "response.object"
    }
];
