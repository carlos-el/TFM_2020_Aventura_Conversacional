const Npc = require("./npc.js");
const NpcState = require("./npcState.js");
const Merchant = require("./merchant.js");
const MerchantState = require("./merchantState.js");

module.exports = class NpcCollection {
    constructor(data) {
        this.npcs = {
            sandra: new Npc({
                names: ["sandra"],
                voice: "Conchita",
                states: {
                    1: new NpcState({ // in road_Camp_hydroelectricPowerPlantOutskirts
                        mentionQuote: ", está esperándome, debería hablar con ella",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["sandra"] = true;

                            // set next state and delete npc from the location.
                            game.npcs["sandra"] = 2;
                            delete game.map.locations[game.map.currentLocation].npcs["sandra"]

                            // If we have already discovered the next location (in our case the camp) put sandra there.
                            if (game.map.locations["camp"]) {
                                game.map.locations["camp"].npcs["sandra"] = false;
                            }
                            // If not, leave the rest to the npc() function in map.js.
                            return "";
                        },
                        speech: "Ya era hora, parece que has espabilado. Vamos al campamento, si vamos hacia el norte llegaremos pronto. No deberíamos demorarnos más en esta expedición. Te espero allí.",
                        speechAlreadyTalked: "",
                    }),
                    2: new NpcState({ // in Camp, starts scene 2 and gives bag, goes to 3 (crossRoads)
                        mentionQuote: " esperándome como dijo",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["sandra"] = true

                            // set next state and delete npc from the location.
                            game.npcs["sandra"] = 3;
                            delete game.map.locations[game.map.currentLocation].npcs["sandra"]

                            // If we have already discovered the next location put sandra there.
                            if (game.map.locations["crossRoads"]) {
                                game.map.locations["crossRoads"].npcs["sandra"] = false;
                            }
                            // If not, leave the rest to the npc() function in map.js.

                            // execute actions the first time we talk to the npc 
                            if (!alreadyTalked) {
                                game.inventory.obtained = true;
                            }

                            // go to scene or stay in location
                            return "scene2_talkToSandraAtCamp";
                        },
                        speech: "",
                        speechAlreadyTalked: "",
                    }),
                    3: new NpcState({ // in crossRoads, gives map, talks about going to fishermanVillage, goes to 4 in scene3
                        mentionQuote: ", debería hablar con ella para que me informe de todo",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["sandra"] = true

                            // execute actions the first time we talk to the npc 
                            if (!alreadyTalked) {
                                game.map.obtained = true;
                            }

                            // go to scene or stay in location
                            return "";
                        },
                        speech: "Bien, parece que ya estas aquí. En el campamento Takumi y Tom nos dijeron que el otro grupo de exploración se dirigía al pequeño pueblo pesquero a orillas del río. El lugar está hacia Oeste. No deberíamos de tardar mucho en llegar. Cuando estes listo simplemente toma el camino. Por cierto, ya que últimamente nos alejamos tanto en las expediciones debería darte un mapa. Te servirá para orientarte y ver donde puedes ir directamente.",
                        speechAlreadyTalked: "Bien, parece que ya estas aquí. En el campamento Takumi y Tom nos dijeron que el otro grupo de exploración se dirigía al pequeño pueblo pesquero a orillas del río. El lugar está hacia Oeste. No deberíamos de tardar mucho en llegar. Cuando estes listo simplemente toma el camino.",
                    }),
                    4: new NpcState({ // in camp, gives hints about asking merchants for gasoline, tells to look for chad and sydney, goes to 5 in scene 5 or 6
                        mentionQuote: ", que puede que me diga que hacer",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["sandra"] = true

                            // go to scene or stay in location
                            return "";
                        },
                        speech: "Ahora que has vuelto del pueblo deberías buscar la manera de cruzar el puente. Les he contado a Takumi y Tom los que ha pasado. Puede que si hablas con ellos te ayuden a encontrar la manera de cruzar el puente. No deberías de demorarte demasiado, no sabemos que les ha podido pasar a Chad y a Sydney.",
                        speechAlreadyTalked: "Ahora que has vuelto del pueblo deberías buscar la manera de cruzar el puente. Les he contado a Takumi y Tom los que ha pasado. Puede que si hablas con ellos te ayuden a encontrar la manera de cruzar el puente. No deberías de demorarte demasiado, no sabemos que les ha podido pasar a Chad y a Sydney.",
                    }),
                    5: new NpcState({ // in camp, tells to follow Sydney hints, goes to 6 on scene 9.
                        mentionQuote: ", con la que debería hablar por si me da algún consejo",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["sandra"] = true;

                            // If not, leave the rest to the npc() function in map.js.
                            return "";
                        },
                        speech: "Hola de nuevo. Oye, todo lo que ha pasado es una pena pero tenemos que encontrar a Sydney sea como sea. Mientras yo cuido del campamento tu deberías seguir su rastro y buscar pistas que nos ayuden a salvarla. No podemos dejar que los rabiosos se salgan con la suya. Bueno, te dejo que sigas con tus cosas. Nos Vemos.",
                        speechAlreadyTalked: "Hola de nuevo. Oye, todo lo que ha pasado es una pena pero tenemos que encontrar a Sydney sea como sea. Mientras yo cuido del campamento tu deberías seguir su rastro y buscar pistas que nos ayuden a salvarla de los rabiosos. Bueno, te dejo que sigas con tus cosas. Nos Vemos.",
                    }),
                    6: new NpcState({ // in militaryCampusEntrance, tells to look for a way of crossing the sporeInfestation, goes to 7 on scene 12.
                        mentionQuote: "está esperándome, debería hablar con ella por si sabe algo",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["sandra"] = true;

                            return "";
                        },
                        speech: "¡Bien hecho! ¡Ya estamos muy cerca de conseguir nuestro objetivo! Chad y tu pillasteis a los rabiosos huyendo hacia las instalaciones del laboratorio en el Norte. No se como han podido cruzar por ese cúmulo de esporas pero nosotros debemos de encontrar rápido una manera de hacer lo mismo. Tengo entendido que la mejor manera de deshacerse de ellos sin infectarse es con fuego. Deberías preguntar en el campamento si alguien puede hecharte un cable con eso. Cuando estés listo acaba con el cúmulo esporas y cruzaremos contigo.",
                        speechAlreadyTalked: "¡Ya estamos muy cerca de conseguir nuestro objetivo! Los rabiosos han escapado hacia las instalaciones del laboratorio en el Norte. No se como han podido cruzar por ese cúmulo de esporas pero nosotros debemos de encontrar rápido una manera de hacer lo mismo. Tengo entendido que la mejor manera de deshacerse de ellos sin infectarse es con fuego. Deberías preguntar en el campamento si alguien puede hecharte un cable con eso. Cuando estés listo acaba con el cúmulo esporas y cruzaremos contigo.",
                    }),
                    7: new NpcState({ // in militaryLaboratoryOutskirts, tells to go to save Sydney, goes to 8 or 9 on scene 13.
                        mentionQuote: "está esperándome, debería hablar con ella",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["sandra"] = true;

                            return "";
                        },
                        speech: "¡Casi los pillamos! Ahora no podemos hecharnos atrás. Algunos rabiosos junto con su líder han huido hacia el Norte. Se que les tienes ganas pero primero deberíamos de ayudar a Sydney. Ella ha sido capaz de escapar hacia el almacén del laboratorio que hay en el Este. Vamos a salvarla cuando estés listo.",
                        speechAlreadyTalked: "¡Casi los pillamos! Ahora no podemos hecharnos atrás. Algunos rabiosos junto con su líder han huido hacia el Norte. Se que les tienes ganas pero primero deberíamos de ayudar a Sydney. Ella ha sido capaz de escapar hacia el almacén del laboratorio que hay en el Este. Preparaté y coge todo lo que creas que puede ser útil. No sabemos lo que podemos encontrarnos a partir de ahora. Ve hacia el almacén cuando estés listo.",
                    }),
                    8: new NpcState({ // in militaryLaboratoryOutskirts, thanks for saving Sydney and go to final, goes to 10 on scene 14.
                        mentionQuote: "está esperándome, debería hablar con ella",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["sandra"] = true;

                            return "";
                        },
                        speech: "¡Perfecto! ¡Hemos logrado salvar a Sydney! Ahora lo tendremos mucho más fácil para acabar con los planes de esos rabiosos. Preparete con todo lo que creas que puede ser de ayuda y vamos a por ellos. Por cierto, desde la explosión nadie puede entrar en las instalaciones del laboratorio sin una máscara que nos proteja de las esporas. Allí dentro la infección es segura.",
                        speechAlreadyTalked: "¡Perfecto! ¡Hemos logrado salvar a Sydney! Ahora lo tendremos mucho más fácil para acabar con los planes de esos rabiosos. Preparete con todo lo que creas que puede ser de ayuda y vamos a por ellos. Por cierto, desde la explosión nadie puede entrar en las instalaciones del laboratorio sin una máscara que nos proteja de las esporas. Allí dentro la infección es segura.",
                    }),
                    9: new NpcState({ // in militaryLaboratoryOutskirts, regret for not saving Sydney and go to final, goes to 10, 11 or 12 on scene 14.
                        mentionQuote: "está esperándome, debería hablar con ella",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["sandra"] = true;

                            return "";
                        },
                        speech: "No hemos podido salvar a Sydney. <break time='1s'/> Aún así no podemos rendirnos ni uqdarnos lamentandonos. Aún nos queda trabajo por hacer. Tenemos que parar el plan de los rabiosos y evitar que ocurra otra catástrofe. Preparete con todo lo que creas que puede ser de ayuda y vamos a por ellos. Por cierto, desde la explosión nadie puede entrar en las instalaciones del laboratorio sin una máscara que nos proteja de las esporas. Allí dentro la infección es segura. Dirígete hacia el Norte cuando estés listo.",
                        speechAlreadyTalked: "No hemos podido salvar a Sydney. <break time='1s'/> Aún así no podemos rendirnos ni uqdarnos lamentandonos. Aún nos queda trabajo por hacer. Tenemos que parar el plan de los rabiosos y evitar que ocurra otra catástrofe. Preparete con todo lo que creas que puede ser de ayuda y vamos a por ellos. Por cierto, desde la explosión nadie puede entrar en las instalaciones del laboratorio sin una máscara que nos proteja de las esporas. Allí dentro la infección es segura. Dirígete hacia el Norte cuando estés listo.",
                    }),
                    10: new NpcState({ // in camp, tells you stopped plan. Last state.
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["sandra"] = true;

                            return "";
                        },
                        speech: "Al final todo ha acabado. No tenemos de que lamentarnos. Hemos conseguido parar el plan de los rabiosos y evitado una catástrofe. Por desgracia su líder logró escapar aunque espero que al menos nos deje tranquilos por ahora. Ya podemos dedicarnos a cuidar el campamento y de los nuestros. Nos vemos más tárde, voy a descansar. Tú también deberías, nos lo merecemos.",
                        speechAlreadyTalked: "Al final todo ha acabado. No tenemos de que lamentarnos. Hemos conseguido parar el plan de los rabiosos y evitado una catástrofe. Por desgracia su líder logró escapar aunque espero que al menos nos deje tranquilos por ahora. Ya podemos dedicarnos a cuidar el campamento y de los nuestros. Nos vemos más tárde. Voy a descansar. Tú también deberías, nos lo merecemos.",
                    }),
                    11: new NpcState({ // in camp, tells you didnt stop plan. Last state.
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["sandra"] = true;

                            return "";
                        },
                        speech: "Al final todo ha acabado. No hemos conseguido nada de lo que nos propusimos. Ahora con esas en el aire la enfermedad se extenderá mucho más. Deberemos de tener cuidado con donde vamos y de las medidas que tomamos para cuidar el campamento. Aún así tenemos que seguir adelante. Estoy segura de que lo conseguiremos. Bueno debo volver a mis tareas, ahora tenemos más trabajo que nunca aquí. Hasta luego.",
                        speechAlreadyTalked: "Al final todo ha acabado. No hemos conseguido nada de lo que nos propusimos. Ahora con esas en el aire la enfermedad se extenderá mucho más. Deberemos de tener cuidado con donde vamos y de las medidas que tomamos para cuidar el campamento. Aún así tenemos que seguir adelante. Estoy segura de que lo conseguiremos. Bueno debo volver a mis tareas, ahora tenemos más trabajo que nunca aquí. Hasta luego.",
                    }),
                    12: new NpcState({ // in camp, tells you stopped plan and killed leader. Last state.
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["sandra"] = true;

                            return "";
                        },
                        speech: "Al final todo ha acabado. No tenemos de que lamentarnos. Hemos conseguido parar el plan de los rabiosos y evitado una catástrofe. Además su líder no nos molestará nunca más. Ya podemos dedicarnos a cuidar el campamento y de los nuestros. Nos vemos más tárde, voy a descansar. Tú también deberías, nos lo merecemos.",
                        speechAlreadyTalked: "Al final todo ha acabado. No tenemos de que lamentarnos. Hemos conseguido parar el plan de los rabiosos y evitado una catástrofe. Además su líder no nos molestará nunca más. Ya podemos dedicarnos a cuidar el campamento y de los nuestros. Nos vemos más tárde, voy a descansar. Tú también deberías, nos lo merecemos.",
                    }),


                },
                merchant: null,
            }),
            chad: new Npc({
                names: ["chad"],
                voice: "Enrique",
                states: {
                    1: new NpcState({ // in highway_1, tells hints about enemies, goes to 2 on scene 9
                        mentionQuote: "está esperándome al borde del camino",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["chad"] = true

                            return "";
                        },
                        speech: "He estado inspeccionando la carretera y hay signos de que los rabiosos se llevaron a Sydney por el camino del Norte, hacia las instalaciones militares. Las huellas son recientes así que es posible que si vamos hacia allí nos encontremos problemas. Deberías ir preparado. Por ejemplo coge algo que sirva como arma o algo así antes de ir a las instalaciones militares.",
                        speechAlreadyTalked: "He estado inspeccionando la carretera y hay signos de que los rabiosos se llevaron a Sydney por el camino del Norte, hacia las instalaciones militares. Las huellas son recientes así que es posible que si vamos hacia allí nos encontremos problemas. Deberías ir preparado. Por ejemplo coge algo que sirva como arma o algo así antes de ir a las instalaciones militares.",
                    }),
                    2: new NpcState({ // in militaryCampusEntrance, tells about scene and going north, goes to 3 on scene 12
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["chad"] = true
                            return "";
                        },
                        speech: "Bueno, que te voy a contar yo. Ya has visto la escena. Los rabiosos han huido hacia el Norte. Tenemos que seguirlos y encontrar a Sydney. Ella podrá decirnos más sobre sus planes. Cuando hayas conseguido limpiar esas esporas asquerosas podremos avanzar.",
                        speechAlreadyTalked: "",
                    }),
                    3: new NpcState({ // in militaryLaboratoryOutskirts, tells about saving Sydney, goes to 4 or 5 on scene 13
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["chad"] = true
                            return "";
                        },
                        speech: "¡Ya los tenemos! ¡No tienen más luagres a donde huir! ¡Deberíamos ir al almacén salvar a Sydney los más rápido posible para que nos ayude a patearles el culo y desbaratarles los planes a esos rabiosos!",
                        speechAlreadyTalked: "¡Ya los tenemos! ¡No tienen más luagres a donde huir! ¡Deberíamos ir al almacén salvar a Sydney los más rápido posible para que nos ayude a patearles el culo y desbaratarles los planes a esos rabiosos!",
                    }),
                    4: new NpcState({ // in militaryLaboratoryOutskirts, regret sydney event, tells about going for enemies, goes to 6 or 7 on scene 14
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["chad"] = true
                            return "";
                        },
                        speech: "Vaya, lo se Sydney ha sido un palo. Hacia mucho que no me sentía tan triste. ¡Ahora tenemos aun más motivos para acabar con los rabiosos! Vamos a por ellos. No los dejaremos ni respirar. ¡Pagarán lo que han hecho!",
                        speechAlreadyTalked: "Vaya, lo se Sydney ha sido un palo. Hacia mucho que no me sentía tan triste. ¡Ahora tenemos aun más motivos para acabar con los rabiosos! Vamos a por ellos. No los dejaremos ni respirar. ¡Pagarán lo que han hecho!",
                    }),
                    5: new NpcState({ // in militaryLaboratoryOutskirts, thanks for saving Sydney, tells about going for enemies, goes to 6 or 7 on scene 14
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["chad"] = true
                            return "";
                        },
                        speech: "¡Están acorralados! Ahora con Sydney a nuestro lado no tienen ninguna oportunidad. ¡Ella sabe como acabar con sus planes! ¡Vamos a acabar con ellos!",
                        speechAlreadyTalked: "¡Están acorralados! Ahora con Sydney a nuestro lado no tienen ninguna oportunidad. ¡Ella sabe como acabar con sus planes! ¡Vamos a acabar con ellos!",
                    }),
                    6: new NpcState({ // in fishermanVillage, tells sydney alive. Last state
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["chad"] = true
                            return "";
                        },
                        speech: "¡Por suerte ya ha acabado esta historia verdad! Al menos ahora puedo seguir explorando con Sydney como siempre. Voy a ponerme a pescar un rato como haciamos antes. Nos vemos luego.",
                        speechAlreadyTalked: "¡Por suerte ya ha acabado esta historia verdad! Al menos ahora puedo seguir explorando con Sydney como siempre. Voy a ponerme a pescar un rato como haciamos antes. Nos vemos luego."
                    }),
                    7: new NpcState({ // in fishermanVillage, tells sydney dead. Last state
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["chad"] = true
                            return "";
                        },
                        speech: "Por suerte ya ha acabado esta historia verdad. Tendremos que seguir intentado sobrevivir como hemos hecho siempre. Echaré de menos a Sydney. Ya no podré ir a explorar con ella. Voy a ponerme a pescar un rato. Nos vemos luego.",
                        speechAlreadyTalked: "Por suerte ya ha acabado esta historia verdad. Tendremos que seguir intentado sobrevivir como hemos hecho siempre. Echaré de menos a Sydney. Ya no podré ir a explorar con ella. Voy a ponerme a pescar un rato. Nos vemos luego.",
                    }),
                },
                merchant: null,
            }),
            sydney: new Npc({
                names: ["sydney"],
                voice: "Lucia",
                states: {
                    1: new NpcState({ // in militaryLaboratoryOutskirts, thanks for saving, tells enemy plans and priorities, goes to 2 or 3 on scene 14
                        mentionQuote: " a la que debería pedir consejo",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["sydney"] = true

                            return "";
                        },
                        speech: "Muchas gracias por salvarme de esos rabiosos, ya no sabía que podía hacer. Bueno. Cambiando de tema, ahora no podemos ponernos melancólicos. Tenemos que pararles los pies y evitar que ejecuten su plan. Cuando me raptaron me obligaron a que los ayudase a terminar un máquina capaz de lanzar sus esporas a la atmósfera. Si lo logran comprometerán la salud de mucha gente y será prácticamente imposible que no nos infectemos todos. Han ubicado la máquina en las instalaciones del laboratorio, en la habitación que explotó hace 17 años. Nuestra prioridad debe ser acabar con el artefacto pase lo que pase, aunque no nos lo pondrán fácil. El líder de esos rabiosos no es normal. Parece más inteligente y capaz de controlar al resto. Estará pendiente del invento así que debemos de distraerlo o neutralizarlo antes de acercarnos a la máquina. Espero que lo logremos. Cuando estes listo ve hacia el laboratorio.",
                        speechAlreadyTalked: "Muchas gracias por salvarme de esos rabiosos, ya no sabía que podía hacer. Cambiando de tema. Tenemos que pararles los pies y evitar que ejecuten su plan. Nuestra prioridad debe ser acabar con el artefacto pase lo que pase. Deberemos tener cuidado con el líder de los rabiosos. Parece más inteligente y capaz de controlar al resto. Estará pendiente del invento así que debemos de distraerlo o neutralizarlo antes de acercarnos a la máquina. Espero que lo logremos. Cuando estes listo ve hacia el laboratorio.",
                    }),
                    2: new NpcState({ // in campWarehouse, gives thanks for stopping enemies plans. Last state
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["sydney"] = true
                            return "";
                        },
                        speech: "Gracias a dios ya no tenemos que preocuparnos más de esos rabiosos. Podemos volver a nuestras vidas normales. Ahora estoy algo ocupada reparando el molino del campamento. Nos vemos luego.",
                        speechAlreadyTalked: "Gracias a dios ya no tenemos que preocuparnos más de esos rabiosos. Podemos volver a nuestras vidas normales. Ahora estoy algo ocupada reparando el molino del campamento. Nos vemos luego.",
                    }),
                    3: new NpcState({ // in campWarehouse, tells enemy plans not stopped. Last state
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["sydney"] = true
                            return "";
                        },
                        speech: "Al final no hemos podido con ellos. Tendremos que ir con cuidado a partir de ahora y dar lo mejor de nosotros para mantener el campamento. No podemos rendirnos, mucha gente depende de nosotros. Ahora estoy algo ocupada reparando el molino del campamento. Nos vemos luego.",
                        speechAlreadyTalked: "Al final no hemos podido con ellos. Tendremos que ir con cuidado a partir de ahora y dar lo mejor de nosotros para mantener el campamento. No podemos rendirnos, mucha gente depende de nosotros. Ahora estoy algo ocupada reparando el molino del campamento. Nos vemos luego.",
                    }),
                },
                merchant: null,
            }),
            dog: new Npc({
                names: ["perro", "el perro"],
                voice: "Carla",
                states: {
                    1: new NpcState({ // in gasStation, thanks for saving, barks, goes to 2 on scene 13
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["dog"] = true

                            return "";
                        },
                        speech: "<audio src='soundbank://soundlibrary/animals/amzn_sfx_dog_med_bark_2x_02'/>",
                        speechAlreadyTalked: "<audio src='soundbank://soundlibrary/animals/amzn_sfx_dog_med_bark_2x_02'/>",
                    }),
                    2: new NpcState({ // in militaryLaboratoryOutskirts, barks. Last state
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["dog"] = true
                            return "";
                        },
                        speech: "<audio src='soundbank://soundlibrary/animals/amzn_sfx_dog_med_bark_2x_02'/>",
                        speechAlreadyTalked: "<audio src='soundbank://soundlibrary/animals/amzn_sfx_dog_med_bark_2x_02'/>",
                    }),
                    3: new NpcState({ // in gasStation, barks happy. Last state
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["dog"] = true
                            return "";
                        },
                        speech: "<audio src='soundbank://soundlibrary/animals/amzn_sfx_dog_small_bark_2x_01'/>",
                        speechAlreadyTalked: "<audio src='soundbank://soundlibrary/animals/amzn_sfx_dog_small_bark_2x_01'/>",
                    }),
                    4: new NpcState({ // in gasStation, barks sad. Last state
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["dog"] = true
                            return "";
                        },
                        speech: "<audio src='soundbank://soundlibrary/animals/amzn_sfx_dog_med_bark_1x_02'/>",
                        speechAlreadyTalked: "<audio src='soundbank://soundlibrary/animals/amzn_sfx_dog_med_bark_1x_02'/>",
                    }),
                },
                merchant: null,
            }),
            takumi: new Npc({
                names: ["takumi", "mercader"],
                voice: "Matthew",
                states: {
                    1: new NpcState({ // in camp, tells about chad and sydney, goes to 2 on scene 3
                        mentionQuote: ", el mercader del campamento. Tal vez pueda comprarle algo de utilidad",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            // Dont ghange it this time because we want it to be false on state 2, which is in the same location
                            //game.map.locations[game.map.currentLocation].npcs["takumi"] = true

                            if (!alreadyTalked) {
                                //Set the merchant state 
                                game.merchants["takumi"] = { state: 1, bought: {} };
                            }

                            return "";
                        },
                        speech: "Hola, ¿qué tal han ido las últimas expediciones? Espero que bien. No podemos decir lo mismo de Chad y Sandra. Deberías ir a ver que les ha pasado. Bueno, estaré siempre aquí.",
                        speechAlreadyTalked: "Hola, ¿qué tal han ido las últimas expediciones? Espero que bien. No podemos decir lo mismo de Chad y Sandra. Deberías ir a ver que les ha pasado. Bueno, estaré siempre aquí.",
                    }),
                    2: new NpcState({ // in camp, tells the gas mision, goes to 3 when relicaryObtained and to 4 when reliquaryNotObtained
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location (in this case it is already true cause we changed state not setting it to false)
                            game.map.locations[game.map.currentLocation].npcs["takumi"] = true

                            return "";
                        },
                        speech: "Hola, ¿cómo estás? Sandra me ha dicho que necesitas algo de combustible para bajar el puente levadizo que hay en el poblado de los pescadores. Por la situación en la que estamos es un recurso muy valioso y raro. Por suerte el otro día conseguí una poca, pero no te la daré así como así. A cambio quiero que me traigas una cosa. Se trata de un antiguo relicario de mi familia. Deberías de poder encontrarlo en mi casa. Para llegar allí debes coger el camino que lleva a la gasolinera desde el cruce de caminos y despues ir hacia el sur. Por cierto, es probable que mi familia escondiera bastante bien el relicario antes de dejar la casa así que sé perspicaz. Como signo de buena fé, si me traes el relicario te diré algo muy interesante que he descubierto sobre la central hidroeléctrica. Y recuerda, sin relicario no hay combustible.",
                        speechAlreadyTalked: "Sandra me ha dicho que necesitas algo de combustible. Por suerte el otro día conseguí una poca. Si me traes el antiguo relicario que escondió mi familia en mi casa te la daré. La casa está al sur de la gasolinera. Como signo de buena fé, si me traes el relicario te diré algo muy interesante que he descubierto sobre la central hidroeléctrica. Recuerda, sin relicario no hay combustible.",
                    }),
                    3: new NpcState({ // in camp, tells thanks for reliquary and begins selling gasoline, goes to 5.
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location (in this case it is already true cause we changed state not setting it to false)
                            game.map.locations[game.map.currentLocation].npcs["takumi"] = true

                            // set next state and set alreadyTalked to false
                            game.npcs["takumi"] = 5;
                            game.map.locations[game.map.currentLocation].npcs["takumi"] = false

                            // set new merchant state
                            game.merchants["takumi"]["state"] = 2

                            // cahnge fuseBox if location discovered, in other case leave it to the elements function
                            if("hydroelectricPowerPlant" in game.map.locations) {
                                game.map.locations["hydroelectricPowerPlant"].elements["fuseBoxHidden"] = false;
                                delete game.map.locations["hydroelectricPowerPlant"].elements; 
                            }
                            game.choices.reliquaryReturned = true;

                            return "";
                        },
                        speech: "¡Vaya! ¡Parece que has conseguido encontrar el relicario! Perfecto, te cambiaré el combustible por el relicario cuando quieras. Como te prometí te diré algo sobre la central hidroeléctrica. La puerta cerrada de su interior puede abrirse. Solo tienes que activar una palanca que hay oculta en un falso fondo de una caja de fusibles.",
                        speechAlreadyTalked: "¡Vaya! ¡Parece que has conseguido encontrar el relicario! Perfecto. Como te prometí te diré algo sobre la central hidroeléctrica. La puerta cerrada de su interior puede abrirse. Solo tienes que activar una palanca que hay oculta en un falso fondo de una caja de fusibles.",
                    }),
                    4: new NpcState({ // in camp, tells that doesnt sell gas, goes to 5.
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location 
                            game.map.locations[game.map.currentLocation].npcs["takumi"] = true

                            // set next state and set alreadyTalked to false
                            game.npcs["takumi"] = 5;
                            game.map.locations[game.map.currentLocation].npcs["takumi"] = false

                            return "";
                        },
                        speech: "Asi que no has conseguido encontrar el relicario. Pues lo siento pero en ese caso no puedo darte el combustible. Nuestra situación no es como para ir regalando cosas.",
                        speechAlreadyTalked: "Asi que no has conseguido encontrar el relicario. Pues lo siento pero en ese caso no puedo darte el combustible. Nuestra situación no es como para ir regalando cosas.",
                    }),
                    5: new NpcState({ // in camp, encourages to continue, goes to 6 on scene 9.
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location 
                            // game.map.locations[game.map.currentLocation].npcs["takumi"] = true

                            return "";
                        },
                        speech: "Debes averiguar que está pasando. Todos en el campamento confiamos en tí. Te dejo que continues con tus quehaceres.",
                        speechAlreadyTalked: "Debes averiguar que está pasando. Todos en el campamento confiamos en tí. Te dejo que continues con tus quehaceres.",
                    }),
                    6: new NpcState({ // in camp, starts selling flamethrower, goes to 7.
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location 
                            game.map.locations[game.map.currentLocation].npcs["takumi"] = true

                            // set next state and set alreadyTalked to false
                            game.npcs["takumi"] = 7;
                            game.map.locations[game.map.currentLocation].npcs["takumi"] = false

                            // set new merchant state depending on if reliquary was found
                            if (game.choices.reliquaryObtained) {
                                game.merchants["takumi"]["state"] = 3
                            } else {
                                game.merchants["takumi"]["state"] = 4
                            }

                            return "";
                        },
                        speech: "Así que necesitas algo que pueda producir mucho fuego ¿no?. De acuerdo, si me traes algunos materiales concretos puedo fabricarte un lanzallamas. Si eso no te vale no se que puede hacerlo.",
                        speechAlreadyTalked: "Así que necesitas algo que pueda producir mucho fuego ¿no?. De acuerdo, si me traes algunos materiales concretos puedo fabricarte un lanzallamas. Si eso no te vale no se que puede hacerlo.",
                    }),
                    7: new NpcState({ // in camp, new merchant state and nothing more, last state.
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location 
                            game.map.locations[game.map.currentLocation].npcs["takumi"] = true

                            return "";
                        },
                        speech: "Yo ya no puedo ayudarte en nada más. Lo siento. Tendrás que seguir el resto del camino tu solo. Suerte.",
                        speechAlreadyTalked: "Yo ya no puedo ayudarte en nada más. Lo siento. Tendrás que seguir el resto del camino tú solo. Suerte.",
                    }),
                },
                merchant: new Merchant({
                    locations: ["camp"],
                    states: {
                        1: new MerchantState({
                            speech: "Si quieres comprar algo avísame.",
                            goods: {
                                trapSmall_1_06h: {
                                    units: 1,
                                    maxBought: 1,
                                    price: {
                                        water: 5,
                                        food: 10,
                                        junk: 5,
                                    }
                                }
                            }
                        }),
                        2: new MerchantState({ // sells gas
                            speech: "Si quieres comprar algo avísame.",
                            goods: {
                                trapSmall_1_06h: {
                                    units: 1,
                                    maxBought: 1,
                                    price: {
                                        water: 5,
                                        food: 10,
                                        junk: 5,
                                    }
                                },
                                gasCan1: {
                                    units: 1,
                                    maxBought: 1,
                                    price: {
                                        reliquary: 1
                                    }
                                },
                            }
                        }),
                        3: new MerchantState({ // sells gas and flamethrower for gasCan1
                            speech: "Si quieres comprar algo avísame.",
                            goods: {
                                trapSmall_1_06h: {
                                    units: 1,
                                    maxBought: 1,
                                    price: {
                                        water: 5,
                                        food: 10,
                                        junk: 5,
                                    }
                                },
                                gasCan1: {
                                    units: 1,
                                    maxBought: 1,
                                    price: {
                                        reliquary: 1
                                    }
                                },
                                flameThrower: {
                                    units: 1,
                                    maxBought: 1,
                                    price: {
                                        brokenBlowTorch: 1,
                                        lighter: 1,
                                        steelPipe: 1,
                                        gasCan1: 1,
                                    }
                                },
                            }
                        }),
                        4: new MerchantState({ // sells only flamethrower for gasCan1
                            speech: "Si quieres comprar algo avísame.",
                            goods: {
                                trapSmall_1_06h: {
                                    units: 1,
                                    maxBought: 1,
                                    price: {
                                        water: 5,
                                        food: 10,
                                        junk: 5,
                                    }
                                },
                                flameThrower: {
                                    units: 1,
                                    maxBought: 1,
                                    price: {
                                        brokenBlowTorch: 1,
                                        lighter: 1,
                                        steelPipe: 1,
                                        gasCan1: 1,
                                    }
                                },
                            }
                        }),
                    }
                }),
            }),
            hugo: new Npc({
                names: ["hugo", "mercader"],
                voice: "Giorgio",
                states: {
                    1: new NpcState({ // in industrialParkEntrance, tells about cleaning industrial area, goes to 2 when sporeClusters 2 and 3 eliminated
                        mentionQuote: ", un mercader ambulante. Puede que intercambie recursos",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["hugo"] = true

                            if (!alreadyTalked) {
                                //Set the merchant state 
                                game.merchants["hugo"] = { state: 1, bought: {} };
                            }

                            return "";
                        },
                        speech: "Buenas. Seguro que te acuerdas de mí. Ya sabes, elimina las esporas la calle Este del polígono industrial donde está mi almacén y te ofreceré intercambios de recursos muy beneficiosos.",
                        speechAlreadyTalked: "Buenas. Seguro que te acuerdas de mí. Ya sabes, elimina las esporas la calle Este del polígono industrial donde está mi almacén y te ofreceré intercambios de recursos muy beneficiosos.",
                    }),
                    2: new NpcState({ // in camp, tells the gas mision, goes to 3 when relicaryObtained and to 4 when reliquaryNotObtained
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location (in this case it is already true cause we changed state not setting it to false)
                            game.map.locations[game.map.currentLocation].npcs["hugo"] = true

                            return "";
                        },
                        speech: "Muchas gracias por limpiar la zona de esporas. Ya puedo acceder a mi almacén con tranquilidad.",
                        speechAlreadyTalked: "Muchas gracias por limpiar la zona de esporas. Ya puedo acceder a mi almacén con tranquilidad.",
                    }),
                },
                merchant: new Merchant({
                    locations: ["industrialParkEntrance"],
                    states: {
                        1: new MerchantState({
                            speech: "",
                            goods: {
                            }
                        }),
                        2: new MerchantState({ 
                            speech: "Si quieres comprar algunos recursos de los que vendo solo dímelo.",
                            goods: {
                                junk: {
                                    units: 20,
                                    maxBought: Infinity,
                                    price: {
                                        food: 10,
                                    }
                                },
                                water: {
                                    units: 20,
                                    maxBought: Infinity,
                                    price: {
                                        food: 10,
                                    }
                                },
                            }
                        }),
                    }
                }),
            }),

            // This character is special. He is a merchant but we cant 'buy' him goods we have to 'give' him packs of resources
            // and he gives nothing back. But each time we give him things he upgrades the campment and gives us things back.
            tom: new Npc({ 
                names: ["tom", "administrador"],
                voice: "Mathieu",
                states: {
                    1: new NpcState({ // in camp, tells about explorers and camp level up system, goes to 2 on scene 3
                        mentionQuote: ", el administrador del campamento",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["tom"] = true

                            // execute actions the first time we talk to the npc 
                            if (!alreadyTalked) {
                                //Set the merchant state to 1
                                game.merchants["tom"] = { state: 1, bought: {} };
                            }

                            return "";
                        },
                        speech: "¡Bien! ya has vuelto de la expedición. ¡Espero que hayas encontrado muchos recursos! Con todos los problemas que hemos tenido no podemos permitirnos que un grupo de expedición se pierda. Será mejor que vayas a buscarlos. Por cierto, últimamente nunca sobra chatarra, agua y alimento para mantener el campamento. Bueno, tu ya sabes como va esto. Dame la cantidad de recursos que puedas y yo iré intentado mantener este sitio. Habla conmigo después de traerme recursos, tal vez pueda hacer algo por tí a cambio.",
                        speechAlreadyTalked: "Con todos los problemas que hemos tenido no podemos permitirnos que un grupo de expedición se pierda. Será mejor que vayas a buscarlos. Por cierto, dame la cantidad de recursos que puedas y yo iré intentado mantener el campamento. Habla conmigo después de traerme recursos, tal vez pueda hacer algo por tí a cambio.",
                    }),
                    2: new NpcState({ // in camp, how to cross bridge 2, goes to 3 on scenes 5 or 7
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["tom"] = true
                            return "";
                        },
                        speech: "Hola, ¿qué tal? Sandra me ha hablado de tu problema. No sé donde hay combustible per si lo que quieres es cruzar a la otra orilla puedes hacerlo por otro puente. Al sur de aquí, en la central hidroeléctrica, también hay un puente que cruza el río. Es un camino más largo pero puede servirte si no encuentras como bajar el puente del poblado. No obstante el puente esta roto así que tendrás que ingeniartelas para cruzarlo. Si subes un par de niveles el campamento yo puedo darte algo que te ayude con esa tarea.",
                        speechAlreadyTalked: "Hola, ¿qué tal? Sandra me ha hablado de tu problema. No sé donde hay combustible per si lo que quieres es cruzar a la otra orilla puedes hacerlo por el puente de la central hidroeléctrica. No obstante el puente esta roto así que tendrás que ingeniartelas para cruzarlo. Si subes un par de niveles el campamento yo puedo darte algo que te ayude con esa tarea.",
                    }),
                    3: new NpcState({ // in camp, tells that you already crossed bridge, goes to 4 on scene 14
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["tom"] = true
                            return "";
                        },
                        speech: "Parece que ya has cruzado a la otra orilla. Bueno yo ya no puedo ayudarte mucho más. Tengo que cuidar del campamento.",
                        speechAlreadyTalked: "Parece que ya has cruzado a la otra orilla. Bueno yo ya no puedo ayudarte mucho más. Tengo que cuidar del campamento.",
                    }),
                    4: new NpcState({ // in camp, everything has ended, last state
                        mentionQuote: "",
                        talkActionTaken: function (game, alreadyTalked) {
                            // Set already talked to true in this location
                            game.map.locations[game.map.currentLocation].npcs["tom"] = true
                            return "";
                        },
                        speech: "Finalmente ha acabado la pesadilla. aún así no podemos descentrarnos. Hay que seguir cuidando del campamento y subiendolo de nivel. No podemos descuidarlo.",
                        speechAlreadyTalked: "Finalmente ha acabado la pesadilla. aún así no podemos descentrarnos. Hay que seguir cuidando del campamento y subiendolo de nivel. No podemos descuidarlo.",
                    }),
                },
                merchant: new Merchant({ // Description of the goods for the administrator is hardcoded, take this into account
                    locations: ["camp"],
                    states: {
                        1: new MerchantState({
                            speech: "Recuerda, dame un pack de recursos cuando puedas.",
                            goods: {
                                pack: {
                                    units: 1,
                                    maxBought: Infinity,
                                    price: {
                                        water: 1,
                                        food: 1,
                                        junk: 1,
                                    }
                                }
                            }
                        })
                    }
                }),
            }),

        }
    }
}