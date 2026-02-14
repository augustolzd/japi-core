import { useState, useEffect } from 'react';
import { Button } from '@japi/ui-system';

interface Organization {
  id: string;
  name: string;
}

export const CreateCostCenterForm = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    initialBalance: '0',
    organizationId: '',
  });

  useEffect(() => {
    fetch('/api/cost-centers')
      .then((res) => res.json())
      .then((data) => setOrganizations(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/cost-centers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Centro de Costos creado con éxito');
        window.location.href = '/cost-centers';
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
        <label htmlFor="cc-name">Nombre de la Unidad / Proyecto</label>
        <input
          id="cc-name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ej: Marketing - Campaña Verano"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="cc-balance">Saldo Inicial (MXN)</label>
        <input
          id="cc-balance"
          type="number"
          step="0.01"
          value={formData.initialBalance}
          onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
          placeholder="0.00"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="cc-org">Organización (Cliente)</label>
        <select
          id="cc-org"
          value={formData.organizationId}
          onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
          required
        >
          <option value="">Selecciona una organización...</option>
          {organizations.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Asignar Centro de Costos'}
        </Button>
        <a href="/cost-centers">Cancelar</a>
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
