import express from "express"
import {getTransactionByUserId,deleteTransaction, createTransaction, getUserTransactionSummary} from "../../controllers/transactionsController.js"

const router = express.Router();


router.get("/:userId", getTransactionByUserId)

router.delete("/:id", deleteTransaction)

router.post("/",createTransaction )

router.get("/summary/:userId", getUserTransactionSummary)

export default router