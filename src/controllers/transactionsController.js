import {sql} from "../config/db.js"

export  async function getTransactionByUserId (req, res){
    try {
        const {userId} = req.params;
        console.log(userId);
        if (!userId) return new res.status(400).message("Empty params")
        const transactions = await sql`
        SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`
        if (transactions.length === 0) return res.status(200).message("")
        return res.status(200).json({transactions})
      
    } catch (error) {
        console.log("Error finding the transaction", error );
        return res.status(500).json({message:"Internal Server error"})
    }
}


export  async function deleteTransaction (req, res) {
    try {
        const {id} = req.params;
        if(!id) return res.json({message: `Field required: id`});
        if (isNaN(parseInt(id))) return res.status(400).json({message: `Invalid input type of ${typeof id}`});

        const transactions = await sql`
            DELETE FROM transactions WHERE id = ${id} RETURNING *
        `
        if (transactions.length === 0) {
            return res.status(400).json({message:"Transaction not found!"});}
        
        return res.status(200).json({
            message:"Successful!",
            body: transactions });
    } catch (error) {
        return res.status(500).json({message:"Internal Server error"});
    }
} 

export async function createTransaction (req, res) {

    try {
        const {title, amount, category, user_id} = req.body;

        if(!title || !user_id || !category || amount === undefined){
            return res.status(400).json({message: "All fields are required" });
        }

        const transaction = await sql`
        INSERT INTO transactions(user_id, title, amount, category)
        VALUES (${user_id}, ${title}, ${amount}, ${category})
        RETURNING *
        `
        console.log(transaction)
        res.status(201).json(transaction[0]);

    } catch (error) {
        console.log("Error creating the transaction", error );
        return res.status(500).json({message:"Internal Server error"});
    }
}

export async function getUserTransactionSummary(req,res){
    const {userId} = req.params;
    if (!userId) return res.json({message: `Field required: id`});
    if (isNaN(parseInt(userId))) return res.status(400).json({message: `Invalid input type of ${typeof id}`});

    try {
        const income = await sql`
            SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND category = ${"income"}
        `
        const expenses = await sql`
            SELECT COALESCE(SUM(amount), 0) AS expenses FROM transactions WHERE user_id = ${userId} AND category = ${"expense"} 
        `

        const finalIncome = (parseFloat(income[0].income) ) ;
        const finalExpenses = parseFloat(expenses[0].expenses ) ;

        const balance =  finalIncome - finalExpenses
        console.log("parsed", balance)
        return res.status(200).json({message:{
            income:finalIncome ?? 0 ,
            expenses: finalExpenses ?? 0,
            balance:balance ?? 0
        }})

    } catch (error) {
        console.log("SUMMARY", error)
        return res.status(500).json({message:"Internal Server error"});
        
    }
}


