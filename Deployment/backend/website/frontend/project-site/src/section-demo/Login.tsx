import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log("Login attempted with:", { email, password });

    try {
      const response = await fetch(
        `http://3.132.3.221:8000/auth?email=${email}&password=${password}`,
      );
      const result = await response.json();

      if (result.status === "good") {
        // Save the busID and email to localStorage
        localStorage.setItem("busID", result.busID);
        localStorage.setItem("email", email);

        console.log("Login successful", result);

        navigate("/map");
      } else {
        console.log("Login failed:", result.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-background rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button className="w-full" onClick={handleSubmit}>
          Log In
        </Button>
      </div>
    </div>
  );
}
