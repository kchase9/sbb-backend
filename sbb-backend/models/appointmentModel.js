
const pool = require('../config/db');

class AppointmentModel {
    static async create(appointmentData) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // First insert the main appointment
            const appointmentQuery = `
                INSERT INTO appointments (
                    user_id,
                    user_email,
                    purpose,
                    appointment_date,
                    status
                )
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `;

            const appointmentValues = [
                appointmentData.userId,
                appointmentData.userEmail,
                appointmentData.purpose,
                appointmentData.appointmentDate,
                'pending'
            ];

            const { rows: [appointment] } = await client.query(appointmentQuery, appointmentValues);

            // Then insert all employees
            const employeeQuery = `
                INSERT INTO appointment_employees (
                    appointment_id,
                    employee_name,
                    job_title
                )
                VALUES ($1, $2, $3)
                RETURNING *;
            `;

            const employeePromises = appointmentData.employees.map(employee =>
                client.query(employeeQuery, [
                    appointment.id,
                    employee.name,
                    employee.jobTitle
                ])
            );

            await Promise.all(employeePromises);

            await client.query('COMMIT');
            return appointment;

        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Error creating appointment: ${error.message}`);
        } finally {
            client.release();
        }
    }

    static async findByUserId(userId) {
        try {
            const query = `
                SELECT 
                    a.*,
                    json_agg(json_build_object(
                        'name', ae.employee_name,
                        'jobTitle', ae.job_title
                    )) as employees
                FROM appointments a
                LEFT JOIN appointment_employees ae ON a.id = ae.appointment_id
                WHERE a.user_id = $1
                GROUP BY a.id
                ORDER BY a.appointment_date DESC;
            `;
            const { rows } = await pool.query(query, [userId]);
            return rows;
        } catch (error) {
            throw new Error(`Error finding appointments: ${error.message}`);
        }
    }

    static async findById(id) {
        try {
            const query = `
                SELECT 
                    a.*,
                    json_agg(json_build_object(
                        'employeeName', ae.employee_name,
                        'jobTitle', ae.job_title
                    )) as employees
                FROM appointments a
                LEFT JOIN appointment_employees ae ON a.id = ae.appointment_id
                WHERE a.id = $1
                GROUP BY a.id
                ORDER BY a.appointment_date DESC;
            `;
            const { rows } = await pool.query(query, [id]);

            return rows;
        } catch (error) {
            throw new Error(`Error finding appointments: ${error.message}`);
        }
    }

    static async findAll() {
        try {
            const query = `
                SELECT 
                    *
                FROM appointments
                ORDER BY appointment_date DESC;
            `;
            const { rows } = await pool.query(query);
            return rows;
        } catch (error) {
            throw new Error(`Error finding appointments: ${error.message}`);
        }
    }


    static async findPending() {
        try {
            const query = `
                SELECT 
                    a.*,
                    json_agg(json_build_object(
                        'name', ae.employee_name,
                        'jobTitle', ae.job_title
                    )) as employees
                FROM appointments a
                LEFT JOIN appointment_employees ae ON a.id = ae.appointment_id
                WHERE a.status = 'pending'
                GROUP BY a.id
                ORDER BY a.appointment_date ASC;
            `;
            const { rows } = await pool.query(query);
            return rows;
        } catch (error) {
            throw new Error(`Error finding pending appointments: ${error.message}`);
        }
    }

    static async updateStatus(id, status) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const query = `
                UPDATE appointments
                SET 
                    status = $2,
                    processed_at = CURRENT_TIMESTAMP
                WHERE id = $1
                RETURNING *;
            `;
            const { rows } = await client.query(query, [ id, status]);

            await client.query('COMMIT');
            return rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Error updating appointment status: ${error.message}`);
        } finally {
            client.release();
        }
    }

    static async delete(id) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Delete employees first due to foreign key constraint
            await client.query('DELETE FROM appointment_employees WHERE appointment_id = $1', [id]);
            
            // Then delete the appointment
            const query = 'DELETE FROM appointments WHERE id = $1 RETURNING *;';
            const { rows } = await client.query(query, [id]);
            
            await client.query('COMMIT');
            return rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Error deleting appointment: ${error.message}`);
        } finally {
            client.release();
        }
    }
}

module.exports = AppointmentModel;