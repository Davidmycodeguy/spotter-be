import fs from "fs";
import path from "path";
import prisma from "./db";

const seed = async () => {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "seed.json"), "utf8")
  );

  for (const item of data) {
    await prisma.product.create({
      data: {
        title: item.title,
        price: item.price,
        image: item.image,
        strikedPrice: item["striked-price"],
        vendor: item.vendor,
      },
    });
  }
};

seed();
