package springapp.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import springapp.domain.Appointment;
import springapp.domain.Client;

@Repository
@Scope("singleton")
public class AppointmentDao {
	
	private Logger logger = LoggerFactory.getLogger(AppointmentDao.class);
	
	RowMapper<Appointment> simpleAppointmentMapper = new RowMapper<Appointment>() {

		@Override
		public Appointment mapRow(ResultSet rs, int rowNum) throws SQLException {
			return new Appointment(rs.getInt("id"), rs.getString("date"), rs.getString("time"), rs.getInt("client_id"));
		}
	};
	
    @Autowired
    JdbcTemplate jdbcTemplate;
    	
	public List<Appointment> list(){
		List<Appointment> queryResult = jdbcTemplate.query(
				"SELECT id, date, time, client_id FROM appointments",
				simpleAppointmentMapper);
		
		
		return queryResult;
	}
	
	public List<Appointment> listForClient(int clientId){
		List<Appointment> queryResult = jdbcTemplate.query(
				"SELECT id, date, time, client_id FROM appointments WHERE client_id = ?",
				new Object[] {clientId},
				simpleAppointmentMapper);
		
		
		return queryResult;
	}
	
	public Appointment get(int id) {
		List<Appointment> queryResult = jdbcTemplate.query(
				"SELECT id, date, time, client_id FROM appointments WHERE id = ? LIMIT 1", 
				new Object[] {id},
				simpleAppointmentMapper);
		
		if(queryResult.isEmpty()) {
			return null;
		}
		
		return queryResult.get(0);
		
		
	}
	
	public Appointment save(Appointment appointment) {
		Integer id = appointment.getId();
		if(id == null) {
			
			KeyHolder holder = new GeneratedKeyHolder();

			jdbcTemplate.update(new PreparedStatementCreator() {
				
				@Override
				public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
					PreparedStatement statement = con.prepareStatement("INSERT INTO appointments(date, time, client_id) VALUES (?, ?, ?)");
					statement.setString(1, appointment.getDate());
					statement.setString(2, appointment.getTime());
					statement.setInt(3, appointment.getClientId());
					return statement;

				}
			}, holder);
			
			id = holder.getKey().intValue();
			
		} else {
			
			jdbcTemplate.update("UPDATE appointments SET date = ?, time = ? WHERE id = ?",
					new Object[] {appointment.getDate(), appointment.getTime(), id});
		}
		
		return get(id);
	}
	
	public void delete(int id) {
		
		jdbcTemplate.update("DELETE FROM appointments WHERE id = ?",
				new Object[] {id});
		
	}
}