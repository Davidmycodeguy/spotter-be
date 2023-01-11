import cors from "cors";
import express from "express";
import prisma from "./db";
const app = express();
const PORT = 3005;

app.use(cors());
app.use(express.json());

app.get("/search", async (req, res) => {
  const { searchText, page = 1, pageSize = 12 } = req.query;

  const totalCount = await prisma.product.count({
    where: {
      OR: [
        { title: { contains: searchText as string, mode: "insensitive" } },
        { vendor: { contains: searchText as string, mode: "insensitive" } },
      ],
    },
  });

  const results = await prisma.product
    .findMany({
      where: {
        OR: [
          { title: { contains: searchText as string, mode: "insensitive" } },
          { vendor: { contains: searchText as string, mode: "insensitive" } },
        ],
      },
      skip: (+page - 1) * +pageSize,
      take: +pageSize,
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "An error occurred" });
    });

  res.json({
    data: results,

    meta: {
      totalCount,
      page: +page,
      pageSize,
      hasNextPage: totalCount > +page * +pageSize,
      totalPages: Math.ceil(totalCount / +pageSize),
    },
  });
});

app.listen(PORT, () => {
  console.log("Example app listening on port 3005!");
});
