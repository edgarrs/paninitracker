(function () {
  const INTRO_STICKERS = [
    { code: 'FWC1', label: 'Official Logo' },
    { code: 'FWC2', label: 'Official Emblem' },
    { code: 'FWC3', label: 'Official Mascot' },
    { code: 'FWC4', label: 'Official Match Ball' },
    { code: 'FWC5', label: 'United States Host Country' },
    { code: 'FWC6', label: 'Mexico Host Country' },
    { code: 'FWC7', label: 'Canada Host Country' },
    { code: 'FWC8', label: 'Official Poster' },
    { code: 'FWC9', label: 'FIFA World Cup Trophy' }
  ];

  const MUSEUM_STICKERS = Array.from({ length: 11 }, function (_, index) {
    return {
      code: 'FWC' + (index + 10),
      label: 'FIFA Museum ' + (index + 1)
    };
  });

  const TEAM_DEFINITIONS = [
    { code: 'ALG', name: 'Algeria' },
    { code: 'ARG', name: 'Argentina' },
    { code: 'AUS', name: 'Australia' },
    { code: 'AUT', name: 'Austria' },
    { code: 'BEL', name: 'Belgium' },
    { code: 'BIH', name: 'Bosnia and Herzegovina' },
    { code: 'BRA', name: 'Brazil' },
    { code: 'CAN', name: 'Canada' },
    { code: 'CPV', name: 'Cape Verde' },
    { code: 'COL', name: 'Colombia' },
    { code: 'COD', name: 'Congo DR' },
    { code: 'CRO', name: 'Croatia' },
    { code: 'CUW', name: 'Curaçao' },
    { code: 'CZE', name: 'Czechia' },
    { code: 'ECU', name: 'Ecuador' },
    { code: 'EGY', name: 'Egypt' },
    { code: 'ENG', name: 'England' },
    { code: 'FRA', name: 'France' },
    { code: 'GER', name: 'Germany' },
    { code: 'GHA', name: 'Ghana' },
    { code: 'HAI', name: 'Haiti' },
    { code: 'IRN', name: 'Iran' },
    { code: 'IRQ', name: 'Iraq' },
    { code: 'CIV', name: 'Ivory Coast' },
    { code: 'JPN', name: 'Japan' },
    { code: 'JOR', name: 'Jordan' },
    { code: 'MEX', name: 'Mexico' },
    { code: 'MAR', name: 'Morocco' },
    { code: 'NED', name: 'Netherlands' },
    { code: 'NZL', name: 'New Zealand' },
    { code: 'NOR', name: 'Norway' },
    { code: 'PAN', name: 'Panama' },
    { code: 'PAR', name: 'Paraguay' },
    { code: 'POR', name: 'Portugal' },
    { code: 'QAT', name: 'Qatar' },
    { code: 'KSA', name: 'Saudi Arabia' },
    { code: 'SCO', name: 'Scotland' },
    { code: 'SEN', name: 'Senegal' },
    { code: 'RSA', name: 'South Africa' },
    { code: 'KOR', name: 'South Korea' },
    { code: 'ESP', name: 'Spain' },
    { code: 'SWE', name: 'Sweden' },
    { code: 'SUI', name: 'Switzerland' },
    { code: 'TUN', name: 'Tunisia' },
    { code: 'TUR', name: 'Turkey' },
    { code: 'URU', name: 'Uruguay' },
    { code: 'USA', name: 'USA' },
    { code: 'UZB', name: 'Uzbekistan' }
  ];

  function createTeamStickers(teamName, teamCode) {
    var playerNumber = 0;

    return Array.from({ length: 20 }, function (_, index) {
      var stickerNumber = index + 1;
      var type;
      var label;

      if (stickerNumber === 1) {
        type = 'badge';
        label = teamName + ' Badge';
      } else if (stickerNumber === 13) {
        type = 'photo';
        label = teamName + ' Team Photo';
      } else {
        playerNumber += 1;
        type = 'player';
        label = teamName + ' Player ' + playerNumber;
      }

      return {
        code: teamCode + stickerNumber,
        label: label,
        type: type
      };
    });
  }

  var teams = TEAM_DEFINITIONS.map(function (team) {
    return {
      code: team.code,
      name: team.name,
      stickers: createTeamStickers(team.name, team.code)
    };
  });

  var sections = [
    {
      id: 'intro',
      name: 'Opening Foils',
      stickers: INTRO_STICKERS.map(function (sticker) {
        return { code: sticker.code, label: sticker.label };
      })
    },
    {
      id: 'museum',
      name: 'FIFA Museum',
      stickers: MUSEUM_STICKERS.map(function (sticker) {
        return { code: sticker.code, label: sticker.label };
      })
    }
  ].concat(
    teams.map(function (team) {
      return {
        id: team.code.toLowerCase(),
        name: team.name,
        stickers: team.stickers.map(function (sticker) {
          return { code: sticker.code, label: sticker.label };
        })
      };
    })
  );

  var stickerInfoByCode = Object.create(null);

  function addStickerInfo(sticker, section, team) {
    stickerInfoByCode[sticker.code] = {
      code: sticker.code,
      label: sticker.label,
      section: section,
      team: team || null,
      type: sticker.type || null
    };
  }

  INTRO_STICKERS.forEach(function (sticker) {
    addStickerInfo(sticker, 'Opening Foils', null);
  });

  MUSEUM_STICKERS.forEach(function (sticker) {
    addStickerInfo(sticker, 'FIFA Museum', null);
  });

  teams.forEach(function (team) {
    team.stickers.forEach(function (sticker) {
      addStickerInfo(sticker, team.name, team.name);
    });
  });

  var allStickerCodes = sections.reduce(function (codes, section) {
    section.stickers.forEach(function (sticker) {
      codes.push(sticker.code);
    });
    return codes;
  }, []);

  var totalStickers = allStickerCodes.length;

  if (totalStickers !== 980) {
    throw new Error('Album data must contain exactly 980 stickers. Found ' + totalStickers + '.');
  }

  window.AlbumData = {
    sections: sections,
    teams: teams,
    allStickerCodes: allStickerCodes,
    getStickerInfo: function (code) {
      var normalizedCode = String(code || '').trim().toUpperCase();
      var info = stickerInfoByCode[normalizedCode];

      return info
        ? {
            code: info.code,
            label: info.label,
            section: info.section,
            team: info.team,
            type: info.type
          }
        : null;
    },
    totalStickers: totalStickers
  };
})();
