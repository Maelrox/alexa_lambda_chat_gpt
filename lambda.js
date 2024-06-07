import https from 'https';

export async function handler(event) {
    if (event.request.type === "IntentRequest" && event.request.intent.name === "ChatIntent") {
        const user_input = event.request.intent.slots.query.value;
        try {
            const response = await getGptResponse(user_input);
            return buildResponse(response);
        } catch (error) {
            console.error(error);
            return buildResponse("I'm sorry, I can't respond to that right now.");
        }
    }
}

function getGptResponse(user_input) {
    return new Promise((resolve, reject) => {
        const messages = [
            {"role": "system", "content": "You are ChatGPT, trained to converse on many topics."},
            {"role": "user", "content": user_input}
        ];

        const data = JSON.stringify({
            model: "gpt-3.5-turbo", 
            messages: messages
        });

        const options = {
            hostname: 'api.openai.com',
            port: 443,
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Bearer *****REPLACE WITH BEARER TOKEN FOR OPENAI******
            }
        };

        const req = https.request(options, (res) => {
            let responseString = '';

            res.on('data', (chunk) => {
                responseString += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    const responseJson = JSON.parse(responseString);
                    resolve(responseJson.choices[0].message.content.trim());
                } else {
                    reject(new Error(API request failed with status ${res.statusCode}: ${responseString}));
                }
            });
        });

        req.on('error', (e) => {
            reject(new Error(Problem with request: ${e.message}));
        });

        req.write(data);
        req.end();
    });
}

function buildResponse(speechText) {
	if (!speechText) {
		speechText = "Sorry, I encountered an error. Please try again later.";
	}
    return {
        version: "1.0",
        response: {
            outputSpeech: {
                type: "PlainText",
                text: speechText
            },
            shouldEndSession: false
        }
    };
}