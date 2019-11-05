"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const chaiAsPromised = require("chai-as-promised");
const portfinder = require("portfinder");
const rp = require("request-promise");
const errors_1 = require("request-promise/errors");
const AlexaPlatform_1 = require("../src/platforms/alexa/AlexaPlatform");
const create_server_1 = require("../src/platforms/create-server");
const VoxaApp_1 = require("../src/VoxaApp");
const views_1 = require("./views");
chai_1.use(chaiAsPromised);
describe("createServer", () => {
    let server;
    let port;
    let adapter;
    beforeEach(async () => {
        const skill = new VoxaApp_1.VoxaApp({ views: views_1.views });
        adapter = new AlexaPlatform_1.AlexaPlatform(skill, {});
    });
    afterEach(() => {
        server.close();
    });
    it("should return 404 on GET", async () => {
        server = create_server_1.createServer(adapter);
        port = await portfinder.getPortPromise();
        server.listen(port, () => console.log(`Listening on ${port}`));
        const options = {
            json: true,
            method: "GET",
            uri: `http://localhost:${port}/`,
        };
        await chai_1.expect(rp(options)).to.eventually.be.rejectedWith(errors_1.StatusCodeError, "404");
    });
    it("should return json response on POST", async () => {
        server = create_server_1.createServer(adapter);
        port = await portfinder.getPortPromise();
        server.listen(port, () => console.log(`Listening on ${port}`));
        const options = {
            body: {
                request: "Hello World",
            },
            json: true,
            method: "POST",
            resolveWithFullResponse: true,
            uri: `http://localhost:${port}/`,
        };
        const response = await rp(options);
        chai_1.expect(response.headers["content-type"]).to.equal("application/json; charset=utf-8");
        chai_1.expect(response.body).to.deep.equal({
            response: {
                outputSpeech: {
                    ssml: "<speak>An unrecoverable error occurred.</speak>",
                    type: "SSML",
                },
                shouldEndSession: true,
            },
            sessionAttributes: {},
            version: "1.0",
        });
    });
    it("should return 500 response on POST with undefined body", async () => {
        server = create_server_1.createServer(adapter);
        port = await portfinder.getPortPromise();
        server.listen(port, () => console.log(`Listening on ${port}`));
        const options = {
            json: true,
            method: "POST",
            resolveWithFullResponse: true,
            uri: `http://localhost:${port}/`,
        };
        try {
            await rp(options);
        }
        catch (err) {
            chai_1.expect(err.name).to.equal("StatusCodeError");
            chai_1.expect(err.statusCode).to.equal(500);
            chai_1.expect(err.response.statusMessage).to.equal("Internal Server Error");
            chai_1.expect(err.response.headers["content-type"]).to.equal("application/json; charset=utf-8");
        }
    });
});
//# sourceMappingURL=create-server.spec.js.map