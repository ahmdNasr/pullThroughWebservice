
module.exports = () => {
	return {
		db_connect: { contactPoints: ['195.88.35.57','195.88.35.61','195.88.35.64'], keyspace: 'comundo'},
		other: { some: "config"}
	}
}()