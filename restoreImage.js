const mongoose = require("mongoose");
const Listing = require("./models/listing");
const initData = require("./init/data");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function restoreImages() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to Database");

        let restored = 0;
        let notFound = 0;

        for (const item of initData.data) {
            const listing = await Listing.findOne({
                title: item.title
            });

            if (!listing) {
                console.log("Listing not found:", item.title);
                notFound++;
                continue;
            }

            if (typeof item.image === "string" && item.image) {
                listing.image = {
                    url: item.image,
                    filename: "seed-image"
                };

                await listing.save();
                restored++;

                console.log("Image restored:", item.title);
            }
        }

        console.log("\nImage restoration completed!");
        console.log("Restored:", restored);
        console.log("Not found:", notFound);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

restoreImages();