import logo from './logo.svg';
import './App.css';
import { useForm } from "react-hook-form";
function ReactHookForm() {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        console.log(data); // { username: "user123", email: "test@example.com" }
    };

      return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
                {...register("username")}
                placeholder="Username"
            />
            <input
                {...register("email")}
                placeholder="Email"
            />
            <button type="submit">Submit</button>
        </form>
    );
}

export default ReactHookForm;
