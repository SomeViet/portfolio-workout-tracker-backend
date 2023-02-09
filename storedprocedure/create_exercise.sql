DELIMITER $$
DROP PROCEDURE IF EXISTS create_exercise;
CREATE DEFINER=`root`@`localhost` PROCEDURE `create_exercise`(
usernamePayload VARCHAR(16383),
weekId int,
dayofweek VARCHAR(16383),
exercise VARCHAR(16383),
sets int,
reps int,
weight int
)
BEGIN
DECLARE exerciseId int;
DECLARE userId int;

INSERT INTO exercises
VALUES (null, dayofweek, exercise, sets, reps, weight);

SET exerciseId = last_insert_id();

SET userId = (SELECT Id FROM users WHERE username = usernamePayload);

INSERT INTO week_exercise
VALUES (null, userId, weekId, exerciseId, now());

SELECT exerciseId;

END$$

DELIMITER ;
