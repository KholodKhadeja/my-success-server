"# my-success-server":

{/*to show all the users that were created in the db*/}
router.get("/", async(req, res))
router.get("/getuserbyid/:id", async (req, res))

router.post("/", async (req, res)=>{
    try{
       const validatedValue = await validateNewUserSchema(req.body);
       const newUser = await createNewUser(validatedValue);
       res.status(201).json({msg:"Added successfully!!"}); 
    }catch(err){
            console.log(err);
            res.status(400).json({err});
    }
});

/*מורה מוסיף שיעור*/
router.post('/:userId/mylessons', async (req, res) => {
    const { userId } = req.params;
    let lesson = req.body;
    try { 
      const theUser = await getUserById(userId);
    if (!theUser) {return res.status(404).json({ error: 'User not found' });}
     lesson = new Lesson({ subject:lesson.subject , 
        topic: lesson.topic,
         learningLevel:lesson.learningLevel ,
         hour:lesson.hour,
         date:lesson.date, 
         students: [],
         zoomLink:lesson.zoomLink,
         teacherId: {_id:userId}});
      lesson = await lesson.save();
      const updatedUser = await updateUserLessonById(userId, lesson);
      console.log(updateUserById);
      res.status(201).json("lesson added to mylessons");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

/*update user details*/
router.patch("/", async (req, res)=>{
    try{
        const validatedValues = await validateUpdateUserSchema(req.body);
        const userData = await updateUserById(req.body._id,req.body);
         res.json({msg:"update completed!"});
    }catch(err){
        console.log(err);
       res.status(400).json({err});
    }
});


/*מחיקת משתמש*/
router.delete("/:id", async (req, res)=>{
    try{
        const validatedValue = await validateDeleteUserSchema(req.params);
        const userData = await deleteUserById(validatedValue.id);
        res.json({msg:"deleted successfully!!"});
    }catch(err){
        res.status(400).json({err});
    }
});

  /*שיעור מתווסף לרשימת מועדפים */
  router.post('/:studentId/favlessons/:lessonId', async (req, res) => {
    const { studentId,lessonId } = req.params;
    try { 
      const theUser = await getUserById(studentId);
    if (!theUser) {return res.status(404).json({ error: 'User not found' });}
      const updatedUser= await updateUserFavLessonById(studentId,{ $push: { favlessons:lessonId} } );
      res.status(201).json("lesson added to student fav successfully");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
 /*removing lesson from myfav array for a student*/
router.delete('/:studentId/favlessons/:lessonId', async (req, res) => {
  const { studentId, lessonId } = req.params;
  try { 
    const theUser = await getUserById(studentId);
  if (!theUser) {return res.status(404).json({ error: 'User not found' });}
    const updatedUser= await updateUserFavLessonById(studentId,{ $pull: { favlessons:lessonId} } );
    res.status(201).json("lesson removed from fav successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

  /*assign lesson to student*/ 
  /*הלומד רושם את עצמו לשיעור*/
  router.post('/:studentId/registertolesson/:lessonId', async (req, res) => {
    const { studentId, lessonId  } = req.params;
    try { 
      const theUser = await getUserById(studentId);
    if (!theUser) {return res.status(404).json({ error: 'User not found' });}
    const updatedUser = await updateUserMyLessonById(studentId, lessonId);
    const updateStudentArr = await addStuToStudentsArray(lessonId, { $push: { students: studentId } });
      res.status(201).json("lesson added to student successfully");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
 /*cancel registration*/
router.delete('/:studentId/mylessons/:lessonId', async (req, res) => {
  const { studentId, lessonId } = req.params;
  const theUser = await getUserById(studentId);
  try { 
  if (!theUser) {return res.status(404).json({ error: 'User not found' });}
    const updatedUser= await updateUserFavLessonById(studentId,{ $pull: { mylessons:lessonId} } );
    const updatedLesson = await addStudentToStudentArrayOfaLesson(lessonId,{ $pull: { students:studentId} } );
    res.status(201).json("lesson removed from mylessons successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
