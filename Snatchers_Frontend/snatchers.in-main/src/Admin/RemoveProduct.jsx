import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RemoveProduct() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/admin/products', { replace: true });
  }, [navigate]);
  return null;
}
