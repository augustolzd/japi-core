import { type ChangeEvent, type FormEvent, useState } from 'react';
import * as v from 'valibot';
import { LoginSchema } from '@japi/events-schema';
import { Button } from '@japi/ui-system';
import styles from './Form.module.css';

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      v.parse(LoginSchema, formData);
      setLoading(true);

      // Get return URL from query params
      const searchParams = new URLSearchParams(window.location.search);
      const returnTo = searchParams.get('returnTo') || 'http://localhost:4322'; // Default to Connect Web

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Credenciales inválidas');
      }

      const { token } = await response.json();

      // SSO Redirect Logic: Redirect back with the token
      const redirectUrl = new URL(returnTo);
      redirectUrl.searchParams.set('token', token);

      alert('Login exitoso! Redirigiendo...');
      window.location.href = redirectUrl.toString();
    } catch (err: unknown) {
      if (err instanceof v.ValiError) {
        const newErrors: Record<string, string> = {};
        for (const issue of err.issues) {
          const path = issue.path?.[0]?.key as string;
          if (path) newErrors[path] = issue.message;
        }
        setErrors(newErrors);
      } else {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        alert(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles['form-container']}>
      <h2 className={styles['form-title']}>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles['form-group']}>
          <label className={styles['form-label']} htmlFor="email">
            Email
          </label>
          <input
            className={styles['form-input']}
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          {errors.email && <span className={styles['form-error']}>{errors.email}</span>}
        </div>

        <div className={styles['form-group']}>
          <label className={styles['form-label']} htmlFor="password">
            Contraseña
          </label>
          <input
            className={styles['form-input']}
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          {errors.password && <span className={styles['form-error']}>{errors.password}</span>}
        </div>

        <div className={styles['form-footer']}>
          <Button className={styles['form-button']} type="submit" disabled={loading}>
            {loading ? 'Validando...' : 'Entrar'}
          </Button>
        </div>
      </form>
    </div>
  );
};
