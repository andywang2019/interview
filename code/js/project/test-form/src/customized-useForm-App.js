import logo from './logo.svg';
import './App.css';
import useForm from './useForm';
function App() {
    const { values, errors, handleChange, handleSubmit } = useForm(
        { usernam: '', email: '' },
        (formData) => {
            console.log('Form submitted:', formData);
            // Submit to API or handle data
        }
    );


    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input name="usernam" value={values.username} onChange={handleChange}/>
                {errors.username && <span>{errors.username}</span>}
            </div>
            <div>
                <label>Email:</label>
                <input name="email" value={values.email} onChange={handleChange}/>
                {errors.email && <span>{errors.email}</span>}
            </div>
            <button type="submit">Submit</button>
        </form>
  );
}

export default App;
