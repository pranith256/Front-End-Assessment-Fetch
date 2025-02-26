import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";


const BASE_URL = process.env.BASE_URL || "https://frontend-take-home-service.fetch.com";

const loginSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login = ({ setIsAuthenticated }: { setIsAuthenticated: (auth: boolean) => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormInputs) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Login failed");
      }
  
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-80">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">Login</h2>

        <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col">
          <input
            type="text"
            placeholder="Name"
            {...register("name")}
            className="border p-2 rounded mb-1 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="border p-2 rounded mt-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
