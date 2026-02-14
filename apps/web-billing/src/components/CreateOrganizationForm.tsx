import { useState, useEffect } from 'react';
import { Button } from '@japi/ui-system';

interface Provider {
  id: string;
  name: string;
}

export const CreateOrganizationForm = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    taxId: '',
    serviceProviderId: '',
  });

  useEffect(() => {
    fetch('/api/organizations')
      .then((res) => res.json())
      .then((data) => setProviders(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Organización creada con éxito');
        window.location.href = '/organizations';
      } else {
        const err = await response.json();
        alert('Error: ' + err.message);
      }
    } catch (err) {
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-stack">
      <div className="field">
        <label>Nombre Legal de la Organización</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Initech S.A."
          required
        />
      </div>

      <div className="field">
        <label>RFC / Tax ID</label>
        <input
          type="text"
          value={formData.taxId}
          onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
          placeholder="ABC010101XYZ"
          required
        />
      </div>

      <div className="field">
        <label>Entidad Facturadora (Service Provider)</label>
        <select
          value={formData.serviceProviderId}
          onChange={(e) => setFormData({ ...formData, serviceProviderId: e.target.value })}
          required
        >
          <option value="">Selecciona un proveedor...</option>
          {providers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Crear Organización'}
        </Button>
        <a href="/organizations">Cancelar</a>
      </div>

      <style>{`
        .form-stack {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 500px;
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .field label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--japi-color-neutral-700);
        }
        .field input, .field select {
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 1px solid var(--japi-color-neutral-300);
          font-size: 1rem;
        }
        .form-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-top: 1rem;
        }
        .form-actions a {
          color: var(--japi-color-neutral-500);
          text-decoration: none;
          font-size: 0.875rem;
        }
      `}</style>
    </form>
  );
};
