const sqlite3 = require('sqlite3').verbose();

function connectDB() {
	return new sqlite3.Database('./data.sqlite3', (err) => {
	  if (err) {
	    return console.error(err.message);
	  }
	});
}

function getCandidates(req, res, next) {
	const db = connectDB();
	var sql = 'WITH RECURSIVE count_query(job_name, total_job_candidates) ' +
	'as (SELECT j.name, COUNT(*) AS count FROM applicants AS a '+
	'JOIN jobs AS j ON a.job_id = j.id group by j.name) ' +

	'SELECT a.id, a.name, a.email, a.website, a.cover_letter, j.name as job_name, cq.total_job_candidates, ' +
	'GROUP_CONCAT(s.name) AS skills, count(s.name) as skill_count ' +

	'FROM applicants AS a INNER JOIN jobs AS j ON a.job_id = j.id ' +
	'LEFT JOIN skills AS s ON a.id = s.applicant_id ' +
	'JOIN count_query as cq ON j.name = cq.job_name ' +

	'GROUP BY a.name ORDER BY j.name DESC;';
	db.all(sql,[],(err, rows) => {
		res.status(200)
		.json({
			status: 'success',
			payload: rows,
		});   
		db.close();
	});
}

function getTotals(req, res, next) {
	const db = connectDB();
	var sql = 'WITH RECURSIVE total_candidates(candidates) ' +
	'as (SELECT COUNT(*) FROM applicants), ' +
	'unique_skills(unique_skills) ' +
	'as (SELECT COUNT(DISTINCT name) FROM skills) ' +

	'SELECT * FROM total_candidates, unique_skills';
	db.all(sql,[],(err, rows) => {
		res.status(200)
		.json({
			status: 'success',
			payload: rows[0],
		});
		db.close();   
	});
}

module.exports = {
	getCandidates: getCandidates,
	getTotals: getTotals,
}