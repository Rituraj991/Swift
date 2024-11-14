import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "../../../../../../utils/dbConfig";
import { Budgets, Expenses } from "../../../../../../utils/schema";
import { Loader } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { toast } from "sonner";

function AddExpense({ budgetId, user, refreshData }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Used to Add New Expense
   */
  const addNewExpense = async () => {
    try {
      setLoading(true);

      // Insert new expense data
      const result = await db.insert(Expenses).values({
        name,
        amount,
        budgetId,
        createdAt: moment().format("DD/MM/YYYY"), // Corrected date format
      }).returning("*"); // Return all fields, or adjust based on your database config

      // Reset input fields if insertion is successful
      if (result) {
        setAmount("");
        setName("");
        refreshData();
        toast("New Expense Added!");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-5 rounded-2xl">
      <h2 className="font-bold text-lg">Add Expense</h2>
      
      {/* Expense Name Input */}
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          placeholder="e.g. Bedroom Decor"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Expense Amount Input */}
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          placeholder="e.g. 1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {/* Add Expense Button */}
      <Button
        disabled={!(name && amount) || loading}
        onClick={addNewExpense}
        className="mt-3 w-full rounded-full"
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Expense"}
      </Button>
    </div>
  );
}

export default AddExpense;
