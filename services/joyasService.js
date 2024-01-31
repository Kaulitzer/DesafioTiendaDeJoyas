const pool = require('../database');
const format = require('pg-format');

const getJoyas = async (req, res) => {
    try {
      const { limits, page, order_by } = req.query;
  
      // Verificar si limits y page son números válidos
      const validLimits = parseInt(limits, 10) || 10;
      const validPage = parseInt(page, 10) || 1;
  
      // Definir la columna por defecto para ordenar
      let orderByColumn = 'id';
      let orderByDirection = 'ASC';
  
      // Verificar si se proporciona un parámetro de orden
      if (order_by) {
        // Dividir el parámetro para obtener la columna y la dirección
        const [column, direction] = order_by.split('_');
  
        // Verificar si la columna es válida y definir la dirección
        if (['id', 'nombre', 'categoria', 'metal', 'precio', 'stock'].includes(column)) {
          orderByColumn = column;
        }
  
        if (direction && direction.toUpperCase() === 'DESC') {
          orderByDirection = 'DESC';
        }
      }
  
      // Consulta parametrizada para obtener joyas con estructura HATEOAS
      const query = format(
        'SELECT * FROM inventario ORDER BY %I %s OFFSET $1 LIMIT $2',
        orderByColumn,
        orderByDirection
      );
  
      const result = await pool.query(query, [(validPage - 1) * validLimits, validLimits]);
  
      // Lógica para estructura HATEOAS (simplemente devolveremos los datos por ahora)
      const joyas = result.rows;
      const estructuraHateoas = joyas.map((joya) => {
        return {
          ...joya,
          links: [{ rel: 'self', href: `/joyas/${joya.id}` }],
        };
      });
  
      res.json({ joyas: estructuraHateoas });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error en la ruta GET /joyas' });
    }
  };
  
  

  const getJoyasFiltros = async (req, res) => {
    try {
      let query = 'SELECT * FROM inventario WHERE true';
      const params = [];
  
      const { precio_min, precio_max, categoria, metal } = req.query;
      let paramCount = 1;
  
      if (precio_min !== undefined) {
        query += ` AND precio >= $${paramCount}`;
        params.push(precio_min);
        paramCount++;
      }
  
      if (precio_max !== undefined) {
        query += ` AND precio <= $${paramCount}`;
        params.push(precio_max);
        paramCount++;
      }
  
      if (categoria !== undefined) {
        query += ` AND categoria = $${paramCount}`;
        params.push(categoria);
        paramCount++;
      }
  
      if (metal !== undefined) {
        query += ` AND metal = $${paramCount}`;
        params.push(metal);
        paramCount++;
      }
  
      const result = await pool.query(query, params);
  
      // Lógica para estructura HATEOAS (simplemente devolveremos los datos por ahora)
      const joyas = result.rows;
      const estructuraHateoas = joyas.map((joya) => {
        return {
          ...joya,
          links: [{ rel: 'self', href: `/joyas/${joya.id}` }],
        };
      });
  
      res.json({ joyas: estructuraHateoas });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: 'Error en la ruta GET /joyas/filtros' });
    }
  };
  

module.exports = { getJoyas, getJoyasFiltros };
