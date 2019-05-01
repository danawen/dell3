package springapp.domain;

public class Appointment {
	private final Integer id;
	private final String start;
	private final String end;
	private final String title;
	private final String backgroundColor;
	private final Integer clientId;

	public Appointment(Integer id, String start, String end, String title, String backgroundColor, Integer clientId) {
		this.id = id;
		this.start = start;
		this.end = end;
		this.title = title;
		this.backgroundColor = backgroundColor;
		this.clientId = clientId;
	}

	/**
	 * @return the clientId
	 */
	public Integer getClientId() {
		return clientId;
	}

	/**
	 * @return the backgroundColor
	 */
	public String getBackgroundColor() {
		return backgroundColor;
	}

	/**
	 * @return the title
	 */
	public String getTitle() {
		return title;
	}

	/**
	 * @return the end
	 */
	public String getEnd() {
		return end;
	}

	/**
	 * @return the start
	 */
	public String getStart() {
		return start;
	}

	/**
	 * @return the id
	 */
	public Integer getId() {
		return id;
	}
}