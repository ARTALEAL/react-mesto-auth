import useForm from '../hooks/useForm';

function Login() {
  const { enteredValues, errors, handleChange } = useForm({});
  return (
    <div className="auth">
      <h2 className="auth__title">Вход</h2>
      <form className="form auth__form" noValidate>
        <input
          type="email"
          placeholder="Email"
          name="email"
          id="email"
          autoComplete="email"
          value={enteredValues.email || ''}
          onChange={handleChange}
          required
        />
        <span className="auth__error">{errors.email}</span>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Пароль"
          autoComplete="password"
          value={enteredValues.password || ''}
          onChange={handleChange}
          required
        />
        <span className="auth__error">{errors.password}</span>
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}

export default Login;
