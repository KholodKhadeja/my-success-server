"# my-success-server":
users router: 
{/*to get all users of system*/}:
router.get("/", async(req, res)):

{/*to get specific userby id*/}:
router.get("/getuserbyid/:id", async (req, res))

{/*to add a new user*/}:
router.post("/", async (req, res))

{/*teachers (by id) add a new lesson*/}:
router.post('/:userId/mylessons', async (req, res))

{/*update user*/}:
router.patch("/", async (req, res))


{/*delete a user*/}:
router.delete("/:id", async (req, res))

{/*user(only students add lesson to their fav lessons list)*/}:
  router.post('/:studentId/favlessons/:lessonId', async (req, res))

 /*users removes lesson from myfav array for a student*/
router.delete('/:studentId/favlessons/:lessonId', async (req, res))

{/*user (student) register to a lesson*/}
  router.post('/:studentId/registertolesson/:lessonId', async (req, res))

{/*user (student) cancel registeriration to a lesson*/}
router.delete('/:studentId/mylessons/:lessonId', async (req, res))


lesson router: 
{/*to get all the lessons*/}
router.get("/", async (req, res))

{/*to get lesson by id*/}
router.get("/getbyid/:id", async (req, res))

{/*to add lesson*/}
router.post("/", authMiddleware ,async (req, res))

{/*to update lesson*/}
router.patch("/", async (req, res))

{/*to delete lesson permenantly from system*/}
router.delete("/:id/:userid", async (req, res))
