import { type ChangeEvent, type FormEvent, useState } from 'react';
import * as v from 'valibot';
import { RegistrationSchema } from '@japi/events-schema';
import { Button } from '@japi/ui-system';
import styles from './Form.module.css';

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      const result = v.parse(RegistrationSchema, formData);
      setLoading(true);

      // In a real app, this would call the API Gateway
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }

      alert('Registro exitoso! Redirigiendo...');
      window.location.href = '/login';
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
      <h2 className={styles['form-title']}>Registro Japifon</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles['form-group']}>
          <label className={styles['form-label']} htmlFor="firstName">
            Nombre
          </label>
          <input
            className={styles['form-input']}
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          {errors.firstName && <span className={styles['form-error']}>{errors.firstName}</span>}
        </div>

        <div className={styles['form-group']}>
          <label className={styles['form-label']} htmlFor="lastName">
            Apellido
          </label>
          <input
            className={styles['form-input']}
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          {errors.lastName && <span className={styles['form-error']}>{errors.lastName}</span>}
        </div>

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
          />
          {errors.password && <span className={styles['form-error']}>{errors.password}</span>}
        </div>

        <div className={styles['form-footer']}>
          <Button className={styles['form-button']} type="submit" disabled={loading}>
            {loading ? 'Procesando...' : 'Crear Cuenta'}
          </Button>
        </div>
      </form>
    </div>
  );
};
