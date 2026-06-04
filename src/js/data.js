(function () {
  var SPECIAL_STICKERS = [
    { code: '00', label: 'Panini Logo' },
    { code: 'FWC1', label: 'Official Emblem' },
    { code: 'FWC2', label: 'Official Emblem' },
    { code: 'FWC3', label: 'Official Mascots' },
    { code: 'FWC4', label: 'Official Slogan' },
    { code: 'FWC5', label: 'Official Ball' },
    { code: 'FWC6', label: 'Canada - Host Countries & Cities' },
    { code: 'FWC7', label: 'Mexico - Host Countries & Cities' },
    { code: 'FWC8', label: 'USA - Host Countries & Cities' },
    { code: 'FWC9', label: 'Italy 1934 - World Cup History' },
    { code: 'FWC10', label: 'Uruguay 1950 - World Cup History' },
    { code: 'FWC11', label: 'West Germany 1954 - World Cup History' },
    { code: 'FWC12', label: 'Brazil 1962 - World Cup History' },
    { code: 'FWC13', label: 'West Germany 1974 - World Cup History' },
    { code: 'FWC14', label: 'Argentina 1986 - World Cup History' },
    { code: 'FWC15', label: 'Brazil 1994 - World Cup History' },
    { code: 'FWC16', label: 'Brazil 2002 - World Cup History' },
    { code: 'FWC17', label: 'Italy 2006 - World Cup History' },
    { code: 'FWC18', label: 'Germany 2014 - World Cup History' },
    { code: 'FWC19', label: 'Argentina 2022 - World Cup History' },
  ];

  var TEAM_DEFINITIONS = [
    { code: 'ALG', name: 'Algeria' },
    { code: 'ARG', name: 'Argentina' },
    { code: 'AUS', name: 'Australia' },
    { code: 'AUT', name: 'Austria' },
    { code: 'BEL', name: 'Belgium' },
    { code: 'BIH', name: 'Bosnia and Herzegovina' },
    { code: 'BRA', name: 'Brazil' },
    { code: 'CAN', name: 'Canada' },
    { code: 'CPV', name: 'Cape Verde' },
    { code: 'CIV', name: 'Ivory Coast' },
    { code: 'COL', name: 'Colombia' },
    { code: 'COD', name: 'Congo DR' },
    { code: 'CRO', name: 'Croatia' },
    { code: 'CUW', name: 'Curacao' },
    { code: 'CZE', name: 'Czechia' },
    { code: 'ECU', name: 'Ecuador' },
    { code: 'EGY', name: 'Egypt' },
    { code: 'ENG', name: 'England' },
    { code: 'ESP', name: 'Spain' },
    { code: 'FRA', name: 'France' },
    { code: 'GER', name: 'Germany' },
    { code: 'GHA', name: 'Ghana' },
    { code: 'HAI', name: 'Haiti' },
    { code: 'IRN', name: 'Iran' },
    { code: 'IRQ', name: 'Iraq' },
    { code: 'JOR', name: 'Jordan' },
    { code: 'JPN', name: 'Japan' },
    { code: 'KOR', name: 'South Korea' },
    { code: 'KSA', name: 'Saudi Arabia' },
    { code: 'MAR', name: 'Morocco' },
    { code: 'MEX', name: 'Mexico' },
    { code: 'NED', name: 'Netherlands' },
    { code: 'NOR', name: 'Norway' },
    { code: 'NZL', name: 'New Zealand' },
    { code: 'PAN', name: 'Panama' },
    { code: 'PAR', name: 'Paraguay' },
    { code: 'POR', name: 'Portugal' },
    { code: 'QAT', name: 'Qatar' },
    { code: 'RSA', name: 'South Africa' },
    { code: 'SCO', name: 'Scotland' },
    { code: 'SEN', name: 'Senegal' },
    { code: 'SUI', name: 'Switzerland' },
    { code: 'SWE', name: 'Sweden' },
    { code: 'TUN', name: 'Tunisia' },
    { code: 'TUR', name: 'Turkiye' },
    { code: 'URU', name: 'Uruguay' },
    { code: 'USA', name: 'USA' },
    { code: 'UZB', name: 'Uzbekistan' },
  ];

  var TEAM_PLAYERS = {
    'ALG': ['Alexis Guendouz', 'Ramy Bensebaini', 'Youcef Atal', 'Rayan Ait-Nouri', 'Mohamed Amine Tougai', 'Aissa Mandi', 'Ismael Bennacer', 'Houssem Aquar', 'Hicham Boudaoui', 'Ramiz Zerrouki', 'Nabil Bentalab', 'Team Photo', 'Fares Chaibi', 'Riyad Mahrez', 'Said Benrahma', 'Anis Hadj Moussa', 'Amine Gouiri', 'Baghdad Bounedjah', 'Mohammed Amoura'],
    'ARG': ['Emiliano Martinez', 'Nahuel Molina', 'Cristian Romero', 'Nicolas Otamendi', 'Nicolas Tagliafico', 'Leonardo Balerdi', 'Enzo Fernandez', 'Alexis Mac Allister', 'Rodrigo De Paul', 'Exequiel Palacios', 'Leandro Paredes', 'Team Photo', 'Nico Paz', 'Franco Mastantuono', 'Nico Gonzalez', 'Lionel Messi', 'Lautaro Martinez', 'Julian Alvarez', 'Giuliano Simeone'],
    'AUS': ['Mathew Ryan', 'Joe Gauci', 'Harry Souttar', 'Alessandro Circati', 'Jordan Bos', 'Aziz Behich', 'Cameron Burgess', 'Lewis Miller', 'Milos Degenek', 'Jackson Irvine', 'Riley McGree', 'Team Photo', 'Aiden O\'Neill', 'Connor Metcalfe', 'Patrick Yazbek', 'Craig Goodwin', 'Kusini Vengi', 'Nestory Irankunda', 'Mohamed Toure'],
    'AUT': ['Alexander Schlager', 'Patrick Pentz', 'David Alaba', 'Kevin Danso', 'Philipp Lienhart', 'Stefan Posch', 'Phillipp Mwene', 'Alexander Prass', 'Xaver Schlager', 'Marcel Sabitzer', 'Konrad Laimer', 'Team Photo', 'Florian Grillitsch', 'Nicolas Seiwald', 'Romano Schmid', 'Patrick Wimmer', 'Christoph Baumgartner', 'Michael Gregoritsch', 'Marko Arnautovic'],
    'BEL': ['Thibaut Courtois', 'Arthur Theate', 'Timothy Castagne', 'Zeno Debast', 'Brandon Mechele', 'Maxim De Cuyper', 'Thomas Meunier', 'Youri Tielemans', 'Amadou Onana', 'Nicolas Raskin', 'Alexis Saelemaekers', 'Team Photo', 'Hans Vanaken', 'Kevin De Bruyne', 'Jeremy Doku', 'Charles De Ketelaere', 'Leandro Trossard', 'Lois Openda', 'Romelu Lukaku'],
    'BIH': ['Nikola Vasilj', 'Amer Dedic', 'Sead Kolasinac', 'Tarik Muharemovic', 'Nihad Mujakic', 'Nikola Katic', 'Amir Hadziahmetovic', 'Benjamin Tahirovic', 'Armin Gigovic', 'Ivan Sunjic', 'Ivan Basic', 'Team Photo', 'Dzenis Burnic', 'Esmir Bajraktarevic', 'Amar Memic', 'Ermedin Demirovic', 'Edin Dzeko', 'Samed Bazdar', 'Haris Tabakovic'],
    'BRA': ['Alisson', 'Bento', 'Marquinhos', 'Eder Militao', 'Gabriel Magalhaes', 'Danilo', 'Wesley', 'Lucas Paqueta', 'Casemiro', 'Bruno Guimaraes', 'Luiz Henrique', 'Team Photo', 'Vinicius Junior', 'Rodrygo', 'Joao Pedro', 'Matheus Cunha', 'Gabriel Martinelli', 'Raphinha', 'Estevao'],
    'CAN': ['Dayne St.Clair', 'Alphonso Davies', 'Alistair Johnston', 'Samuel Adekugbe', 'Riche Larvea', 'Derek Cornelius', 'Moise Bombito', 'Kamal Miller', 'Stephen Eustaquio', 'Ismael Kone', 'Jonathan Osorio', 'Team Photo', 'Jacob Shaffelburg', 'Mathieu Choiniere', 'Niko Sigur', 'Tajon Buchanan', 'Liam Millar', 'Cyle Larin', 'Jonathan David'],
    'CPV': ['Vozinha', 'Logan Costa', 'Pico', 'Diney', 'Steven Moreira', 'Wagner Pina', 'Joao Paulo', 'Yannick Semedo', 'Kevin Pina', 'Patrick Andrade', 'Jamiro Monteiro', 'Team Photo', 'Deroy Duarte', 'Garry Rodrigues', 'Jovane Cabral', 'Ryan Mendes', 'Dailon Livramento', 'Willy Semedo', 'Bebe'],
    'CIV': ['Yahia Fofana', 'Ghislain Konan', 'Wilfried Singo', 'Odilon Kossounou', 'Evan Ndicka', 'Willy Boly', 'Emmanuel Agbadou', 'Ousmane Diomande', 'Franck Kessie', 'Seko Fofana', 'Ibrahim Sangare', 'Team Photo', 'Jean-Philippe Gbamin', 'Amad Diallo', 'Sebastien Haller', 'Simon Adingra', 'Yan Diomande', 'Evann Guessand', 'Oumar Diakite'],
    'COL': ['Camilo Vargas', 'David Ospina', 'Davinson Sanchez', 'Yerry Mina', 'Daniel Munoz', 'Johan Mojica', 'Jhon Lucumi', 'Santiago Arias', 'Jefferson Lerma', 'Kevin Castano', 'Richard Rios', 'Team Photo', 'James Rodriguez', 'Juan Fernando Quintero', 'Jorge Carrascal', 'Jon Arias', 'Jhon Cordova', 'Luis Suarez', 'Luis Diaz'],
    'COD': ['Lionel Mpasi', 'Aaron Wan-Bissaka', 'Axel Tuanzebe', 'Arthur Masuaku', 'Chancel Mbemba', 'Joris Kayembe', 'Charles Pickel', 'Ngal\'ayel Mukau', 'Edo Kayembe', 'Samuel Moutoussamy', 'Noah Sadiki', 'Team Photo', 'Theo Bongonda', 'Meschak Elia', 'Yoane Wissa', 'Brian Cipenga', 'Fiston Mayele', 'Cedric Bakambu', 'Nathanael Mbuku'],
    'CRO': ['Dominik Livakovic', 'Duje Caleta-Car', 'Josko Gvardiol', 'Josip Stanisic', 'Luka Vuskovic', 'Josip Sutalo', 'Kristijan Jakic', 'Luka Modric', 'Mateo Kovacic', 'Martin Baturina', 'Lovro Majer', 'Team Photo', 'Mario Pasalic', 'Petar Sucic', 'Ivan Perisic', 'Marco Pasalic', 'Ante Budimir', 'Andrej Kramaric', 'Franjo Ivanovic'],
    'CUW': ['Eloy Room', 'Armando Obispo', 'Sherel Floranus', 'Jurien Gaari', 'Joshua Brenet', 'Roshon Van Eijma', 'Shurandy Sambo', 'Livano Comenencia', 'Godfried Roemeratoe', 'Juninho Bacuna', 'Leandro Bacuna', 'Team Photo', 'Tahith Chong', 'Kenji Gorre', 'Jearl Margaritha', 'Jurgen Locadia', 'Jeremy Antonisse', 'Gervane Kastaneer', 'Sontje Hansen'],
    'CZE': ['Matej Kovar', 'Jindrich Stanek', 'Ladislav Krejci', 'Vladimir Coufal', 'Jaroslav Zeleny', 'Tomas Holes', 'David Zima', 'Michal Sadilek', 'Lukas Provod', 'Lukas Cerv', 'Tomas Soucek', 'Team Photo', 'Pavel Sulc', 'Matej Vydra', 'Vasil Kusej', 'Tomas Chory', 'Vaclav Cerny', 'Adam Hlozek', 'Patrik Schick'],
    'ECU': ['Hernan Galindez', 'Gonzalo Valle', 'Piero Hincapie', 'Pervis Estupinan', 'Willian Pacho', 'Angelo Preciado', 'Joel Ordonez', 'Moises Caicedo', 'Alan Franco', 'Kendry Paez', 'Pedro Vite', 'Team Photo', 'John Veboah', 'Leonardo Campana', 'Gonzalo Plata', 'Nilson Angulo', 'Alan Minda', 'Kevin Rodriguez', 'Enner Valencia'],
    'EGY': ['Mohamed El Shenawy', 'Mohamed Hany', 'Mohamed Hamdy', 'Yasser Ibrahim', 'Khaled Sobhi', 'Ramy Rabia', 'Hossam Abdelmaguid', 'Ahmed Fatouh', 'Marwan Attia', 'Zizo', 'Hamdy Fathy', 'Team Photo', 'Mohamed Lasheen', 'Emam Ashour', 'Osama Faisal', 'Mohamed Salah', 'Mostafa Mohamed', 'Trezeguet', 'Omar Marmoush'],
    'ENG': ['Jordan Pickford', 'John Stones', 'Marc Guehi', 'Ezri Konsa', 'Trent Alexander-Arnold', 'Reece James', 'Dan Burn', 'Jordan Henderson', 'Declan Rice', 'Jude Bellingham', 'Cole Palmer', 'Team Photo', 'Morgan Rogers', 'Anthony Gordon', 'Phil Foden', 'Bukayo Saka', 'Harry Kane', 'Marcus Rashford', 'Ollie Watkins'],
    'ESP': ['Unai Simon', 'Robin Le Normand', 'Aymeric Laporte', 'Dean Huijsen', 'Pedro Porro', 'Dani Carvajal', 'Marc Cucurella', 'Martin Zubimendi', 'Rodri', 'Pedri', 'Fabian Ruiz', 'Team Photo', 'Mikel Merino', 'Lamine Yamal', 'Dani Olmo', 'Nico Williams', 'Ferran Torres', 'Alvaro Morata', 'Mikel Oyarzabal'],
    'FRA': ['Mike Maignan', 'Theo Hernandez', 'William Saliba', 'Jules Kounde', 'Ibrahima Konate', 'Dayot Upamecano', 'Lucas Digne', 'Aurelien Tchouameni', 'Eduardo Camavinga', 'Manu Kone', 'Adrien Rabiot', 'Team Photo', 'Michael Olise', 'Ousmane Dembele', 'Bradley Barcola', 'Desire Doue', 'Kingsley Coman', 'Hugo Ekitike', 'Kylian Mbappe'],
    'GER': ['Marc-Andre ter Stegen', 'Jonathan Tah', 'David Raum', 'Nico Schlotterbeck', 'Antonio Rudiger', 'Waldemar Anton', 'Ridle Baku', 'Maximilian Mittelstadt', 'Joshua Kimmich', 'Florian Wirtz', 'Felix Nmecha', 'Team Photo', 'Leon Goretzka', 'Jamal Musiala', 'Serge Gnabry', 'Kai Havertz', 'Leroy Sane', 'Karim Adeyemi', 'Nick Woltemade'],
    'GHA': ['Lawrence Ati Zigi', 'Tariq Lamptey', 'Mohammed Salisu', 'Alidu Seidu', 'Alexander Djiku', 'Gideon Mensah', 'Caleb Yirenkyi', 'Abdul Issahaku Fatawu', 'Thomas Partey', 'Salis Abdul Samed', 'Kamaldeen Sulemana', 'Team Photo', 'Mohammed Kudus', 'Inaki Williams', 'Jordan Ayew', 'Andrew Ayew', 'Joseph Paintsil', 'Osman Bukari', 'Antoine Semenyo'],
    'HAI': ['Johny Placide', 'Carlens Arcus', 'Martin Experience', 'Jean-Kevin Duverne', 'Ricardo Ade', 'Duke Lacroix', 'Garven Metusala', 'Hannes Delcroix', 'Leverton Pierre', 'Danley Jean Jacques', 'Jean-Ricner Bellegarde', 'Team Photo', 'Christopher Attys', 'Derrick Etienne Jr', 'Josue Casimir', 'Ruben Providence', 'Duckens Nazon', 'Louicius Deedson', 'Frantzdy Pierrot'],
    'IRN': ['Alireza Beiranvand', 'Morteza Pouraliganji', 'Ehsan Hajsafi', 'Milad Mohammadi', 'Shojae Khalilzadeh', 'Ramin Rezaeian', 'Hossein Kanaani', 'Sadegh Moharrami', 'Saleh Hardani', 'Saeed Ezatolahi', 'Saman Ghoddos', 'Team Photo', 'Omid Noorafkan', 'Roozbeh Cheshmi', 'Mohammad Mohebi', 'Sardar Azmoun', 'Mehdi Taremi', 'Alireza Jahanbakhsh', 'Ali Gholizadeh'],
    'IRQ': ['Jalal Hassan', 'Rebin Sulaka', 'Hussein Ali', 'Akam Hashem', 'Merchas Doski', 'Zaid Tahseen', 'Manaf Younis', 'Zidane Iqbal', 'Amir Al-Ammari', 'Ibrahim Bavesh', 'Ali Jasim', 'Team Photo', 'Youssef Amyn', 'Aimar Sher', 'Marko Farji', 'Osama Rashid', 'Ali Al-Hamadi', 'Aymen Hussein', 'Mohanad Ali'],
    'JOR': ['Yazeed Abulaila', 'Ihsan Haddad', 'Mohammad Abu Hashish', 'Yazan Al-Arab', 'Abdallah Nasib', 'Saleem Obaid', 'Mohammad Abualnadi', 'Ibrahim Saadeh', 'Nizar Al-Rashdan', 'Noor Al-Rawabdeh', 'Mohannad Abu Taha', 'Team Photo', 'Amer Jamous', 'Musa Al-Taamari', 'Yazan Al-Naimat', 'Mahmoud Al-Mardi', 'Ali Olwan', 'Mohammad Abu Zrayq', 'Ibrahim Sabra'],
    'JPN': ['Zion Suzuki', 'Henry Heroki Mochizuki', 'Ayumu Seko', 'Junnosuke Suzuki', 'Shogo Taniguchi', 'Tsuyoshi Watanabe', 'Kaishu Sano', 'Yuki Soma', 'Ao Tanaka', 'Daichi Kamada', 'Takefusa Kubo', 'Team Photo', 'Ritsu Doan', 'Keito Nakamura', 'Takumi Minamino', 'Shuto Machino', 'Junya Ito', 'Koki Ogawa', 'Ayase Ueda'],
    'KOR': ['Hyeon-woo Jo', 'Seung-Gyu Kim', 'Min-jae Kim', 'Yu-min Cho', 'Young-woo Seol', 'Han-beom Lee', 'Tae-seok Lee', 'Myung-jae Lee', 'Jae-sung Lee', 'In-beom Hwang', 'Kang-in Lee', 'Team Photo', 'Seung-ho Paik', 'Jens Castrop', 'Dongg-yeong Lee', 'Gue-sung Cho', 'Heung-min Son', 'Hee-chan Hwang', 'Hyeon-Gyu Oh'],
    'KSA': ['Nawaf Alaqidi', 'Abdulrahman Al-Sanbi', 'Saud Abdulhamid', 'Nawaf Bouwashl', 'Jihad Thakri', 'Moteb Al-Harbi', 'Hassan Altambakti', 'Musab Aljuwayr', 'Ziyad Aljohani', 'Abdullah Alkhaibari', 'Nasser Aldawsari', 'Team Photo', 'Saleh Abu Alshamat', 'Marwan Alsahafi', 'Salem Aldawsari', 'Abdulrahman Al-Aboud', 'Feras Akbrikan', 'Saleh Alshehri', 'Abdullah Al-Hamdan'],
    'MAR': ['Yassine Bounou', 'Munir El Kajoui', 'Achraf Hakimi', 'Noussair Mazraoui', 'Nayef Aguerd', 'Roman Saiss', 'Jawad El Yamio', 'Adam Masina', 'Sofyan Amrabat', 'Azzedine Ounahi', 'Eliesse Ben Seghir', 'Team Photo', 'Bilal El Khannouss', 'Ismael Saibari', 'Youssef En-Nesyri', 'Abde Ezzalzouli', 'Soufiane Rahimi', 'Brahim Diaz', 'Ayoub El Kaabi'],
    'MEX': ['Luis Malagon', 'Johan Vasquez', 'Jorge Sanchez', 'Cesar Montes', 'Jesus Gallardo', 'Israel Reyes', 'Diego Lainez', 'Carlos Rodriguez', 'Edson Alvarez', 'Orbelin Pineda', 'Marcel Ruiz', 'Team Photo', 'Erick Sanchez', 'Hirving Lozano', 'Santiago Gimenez', 'Raul Jimenez', 'Alexis Vega', 'Roberto Alvarado', 'Cesar Huerta'],
    'NED': ['Bart Verbruggen', 'Virgil van Dijk', 'Micky van de Ven', 'Jurrien Timber', 'Denzel Dumfries', 'Nathan Ake', 'Jeremie Frimpong', 'Jan Paul van Hecke', 'Tijjani Reijnders', 'Ryan Gravenberch', 'Teun Koopmeiners', 'Team Photo', 'Frenkie de Jong', 'Xavi Simons', 'Justin Kluivert', 'Memphis Depay', 'Donyell Malen', 'Wout Weghorst', 'Cody Gakpo'],
    'NOR': ['Orjan Nyland', 'Julian Ryerson', 'Leo Ostigard', 'Kristoffer Vassbakk Ajer', 'Marcus Holmgren Pedersen', 'David Moller Wolfe', 'Torbjorn Heggem', 'Morten Thorsby', 'Martin Odegaard', 'Sander Berge', 'Andreas Schjelderup', 'Team Photo', 'Patrick Berg', 'Erling Haaland', 'Alexander Sorloth', 'Aron Donnum', 'Jorgen Strand Larsen', 'Antonio Nusa', 'Oscar Bobb'],
    'NZL': ['Max Crocombe Payne', 'Alex Paulsen', 'Michael Boxall', 'Liberato Cacace', 'Tim Payne', 'Tyler Bindon', 'Francis de Vries', 'Finn Surman', 'Joe Bell', 'Sarpreet Singh', 'Ryan Thomas', 'Team Photo', 'Matthew Garbett', 'Marko Stamenic', 'Ben Old', 'Chris Wood', 'Elijah Just', 'Callum McCowatt', 'Kosta Barbarouses'],
    'PAN': ['Orlando Mosquera', 'Luis Mejia', 'Fidel Escobar', 'Andres Andrade', 'Michael Amir Murillo', 'Eric Davis', 'Jose Cordoba', 'Cesar Blackman', 'Cristian Martinez', 'Anibal Godoy', 'Adalberto Carrasquilla', 'Team Photo', 'Edgar Barcenas', 'Carlos Harvey', 'Ismael Diaz', 'Jose Fajardo', 'Cecilio Waterman', 'Jose Luiz Rodriguez', 'Alberto Quintero'],
    'PAR': ['Roberto Fernandez', 'Orlando Gill', 'Gustavo Gomez', 'Fabian Balbuena', 'Juan Jose Caceres', 'Omar Alderete', 'Junior Alonso', 'Mathias Villasanti', 'Diego Gomez', 'Damian Bobadilla', 'Andres Cubas', 'Team Photo', 'Matias Galarza Fonda', 'Julio Enciso', 'Alejandro Romero Gamarra', 'Miguel Almiron', 'Ramon Sosa', 'Angel Romero', 'Antonio Sanabria'],
    'POR': ['Diogo Costa', 'Jose Sa', 'Ruben Dias', 'Joao Cancelo', 'Diogo Dalot', 'Nuno Mendes', 'Goncalo Inacio', 'Bernardo Silva', 'Bruno Fernandes', 'Ruben Neves', 'Vitinha', 'Team Photo', 'Joao Neves', 'Cristiano Ronaldo', 'Francisco Trincao', 'Joao Felix', 'Goncalo Ramos', 'Pedro Neto', 'Rafael Leao'],
    'QAT': ['Meshaal Barsham', 'Sultan Albrake', 'Lucas Mendes', 'Homam Ahmed', 'Boualem Khoukhi', 'Pedro Miguel', 'Tarek Salman', 'Mohamed Al-Mannai', 'Karim Boudiaf', 'Assim Madibo', 'Ahmed Fatehi', 'Team Photo', 'Mohammed Waad', 'Abdulaziz Hatem', 'Hassan Al-Haydos', 'Edmilson Junior', 'Akram Hassan Afif', 'Ahmed Al Ganehi', 'Almoez Ali'],
    'RSA': ['Ronwen Williams', 'Sipho Chaine', 'Aubrey Modiba', 'Samukele Kabini', 'Mbekezeli Mbokazi', 'Khulumani Ndamane', 'Siyabonga Ngezana', 'Khuliso Mudau', 'Nkosinathi Sibisi', 'Teboho Mokoena', 'Thalente Mbatha', 'Team Photo', 'Bathasi Aubaas', 'Yaya Sithole', 'Sipho Mbule', 'Lyle Foster', 'Iqraam Rayners', 'Mohau Nkota', 'Oswin Appollis'],
    'SCO': ['Angus Gunn', 'Jack Hendry', 'Kieran Tierney', 'Aaron Hickey', 'Andrew Robertson', 'Scott McKenna', 'John Souttar', 'Anthony Ralston', 'Grant Hanley', 'Scott McTominay', 'Billy Gilmour', 'Team Photo', 'Lewis Ferguson', 'Ryan Christie', 'Kenny McLean', 'John McGinn', 'Lyndon Dykes', 'Che Adams', 'Ben Gannon-Doak'],
    'SEN': ['Edouard Mendy', 'Yehvann Diouf', 'Moussa Niakhate', 'Abdoulaye Seck', 'Ismail Jakobs', 'El Hadji Malick Diouf', 'Kalidou Koulibaly', 'Idrissa Gana Gueye', 'Pape Matar Sarr', 'Pape Gueye', 'Habib Diarra', 'Team Photo', 'Lamine Camara', 'Sadio Mane', 'Ismaila Sarr', 'Boulaye Dia', 'Iliman Ndiaye', 'Nicolas Jackson', 'Krepin Diatta'],
    'SUI': ['Gregor Kobel', 'Yvon Mvogo', 'Manuel Akanji', 'Ricardo Rodriguez', 'Nico Elvedi', 'Aurele Amenda', 'Silvan Widmer', 'Granit Xhaka', 'Denis Zakaria', 'Remo Freuler', 'Fabian Rieder', 'Team Photo', 'Ardon Jashari', 'Johan Manzambi', 'Michel Aebischer', 'Breel Embolo', 'Ruben Vargas', 'Dan Ndoye', 'Zeki Amdouni'],
    'SWE': ['Victor Johansson', 'Isak Hien', 'Gabriel Gudmundsson', 'Emil Holm', 'Victor Nilsson Lindelof', 'Gustaf Lagerbielke', 'Lucas Bergvall', 'Hugo Larsson', 'Jesper Karlstrom', 'Yasin Ayari', 'Mattias Svanberg', 'Team Photo', 'Daniel Svensson', 'Ken Sema', 'Roony Bardghji', 'Dejan Kulusevski', 'Anthony Elanga', 'Alexander Isak', 'Viktor Gyokeres'],
    'TUN': ['Bechir Ben Said', 'Aymen Dahmen', 'Yan Valery', 'Montassar Talbi', 'Yassine Meriah', 'Ali Abdi', 'Dylan Bronn', 'Ellyes Skhiri', 'Aissa Laidouni', 'Ferjani Sassi', 'Mohamed Ali Ben Romdhane', 'Team Photo', 'Hannibal Mejbri', 'Elias Achouri', 'Elias Saad', 'Hazem Mastouri', 'Ismael Gharbi', 'Sayfallah Ltaief', 'Naim Sliti'],
    'TUR': ['Ugurcan Cakir', 'Mert Muldur', 'Zeki Celik', 'Abdulkerim Bardakci', 'Caglar Soyuncu', 'Merih Demiral', 'Ferdi Kadioglu', 'Kaan Ayhan', 'Ismail Yuksek', 'Hakan Calhanoglu', 'Orkun Kokcu', 'Team Photo', 'Arda Guler', 'Irfan Can Kahveci', 'Yunus Akgun', 'Can Uzun', 'Baris Alper Yilmaz', 'Kerem Akturkoglu', 'Kenan Yildiz'],
    'URU': ['Sergio Rochet', 'Santiago Mele', 'Ronald Araujo', 'Jose Maria Gimenez', 'Sebastian Caceres', 'Mathias Olivera', 'Guillermo Varela', 'Nahitan Nandez', 'Federico Valverde', 'Giorgian De Arrascaeta', 'Rodrigo Bentancur', 'Team Photo', 'Manuel Ugarte', 'Nicolas de la Cruz', 'Maxi Araujo', 'Darwin Nunez', 'Federico Vinas', 'Rodrigo Aguirre', 'Facundo Pellistri'],
    'USA': ['Math Freese', 'Chris Richards', 'Tim Ream', 'Mark McKenzie', 'Alex Freeman', 'Antonee Robinson', 'Tyler Adams', 'Tanner Tessmann', 'Weston McKenny', 'Christian Roldan', 'Timothy Weah', 'Team Photo', 'Diego Luna', 'Malik Tillman', 'Christian Pulisic', 'Brenden Aaronson', 'Ricardo Pepi', 'Haji Wright', 'Folarin Balogun'],
    'UZB': ['Utkir Yusupov', 'Farrukh Savfiev', 'Sherzod Nasrullaev', 'Umar Eshmurodov', 'Husniddin Aliqulov', 'Rustamjon Ashurmatov', 'Khojiakbar Alijonov', 'Abdukodir Khusanov', 'Odiljon Hamrobekov', 'Otabek Shukurov', 'Jamshid Iskanderov', 'Team Photo', 'Azizbek Turgunboev', 'Khojimat Erkinov', 'Eldor Shomurodov', 'Oston Urunov', 'Jaloliddin Masharipov', 'Igor Sergeev', 'Abbosbek Fayzullaev'],
  };

  function buildTeamStickers(teamCode) {
    var players = TEAM_PLAYERS[teamCode] || [];
    var stickers = [{ code: teamCode + '1', label: 'Team Logo' }];
    for (var i = 0; i < players.length; i++) {
      stickers.push({ code: teamCode + (i + 2), label: players[i] });
    }
    return stickers;
  }

  var sections = [
    { name: 'FIFA World Cup 2026', stickers: SPECIAL_STICKERS }
  ];

  TEAM_DEFINITIONS.forEach(function (team) {
    sections.push({
      name: team.name,
      teamCode: team.code,
      stickers: buildTeamStickers(team.code)
    });
  });

  var allStickerCodes = [];
  sections.forEach(function (section) {
    section.stickers.forEach(function (s) {
      allStickerCodes.push(s.code);
    });
  });

  function getStickerInfo(code) {
    for (var i = 0; i < sections.length; i++) {
      var section = sections[i];
      for (var j = 0; j < section.stickers.length; j++) {
        if (section.stickers[j].code === code) {
          return { section: section.name, label: section.stickers[j].label, code: code };
        }
      }
    }
    return null;
  }

  window.AlbumData = {
    sections: sections,
    allStickerCodes: allStickerCodes,
    getStickerInfo: getStickerInfo,
    totalStickers: allStickerCodes.length
  };
})();