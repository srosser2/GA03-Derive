// const url = 'https://getavataaars.com/?accessoriesType=Blank&avatarStyle=Circle&clotheColor=White&clotheType=ShirtCrewNeck&eyeType=Default&eyebrowType=DefaultNatural&facialHairColor=Brown&facialHairType=BeardLight&graphicType=SkullOutline&hairColor=Brown&hatColor=Red&mouthType=Serious&skinColor=Light&topType=ShortHairShortCurly'

const options = {
  'topType': [
    'NoHair',
    'Eyepatch',
    'Hat',
    'Hijab',
    'Turban',
    'WinterHat1',
    'WinterHat2',
    'WinterHat3',
    'WinterHat4',
    'LongHairBigHair',
    'LongHairBob',
    'LongHairBun',
    'LongHairCurly',
    'LongHairCurvy',
    'LongHairDreads',
    'LongHairFrida',
    'LongHairFro',
    'LongHairFroBand',
    'LongHairNotTooLong',
    'LongHairShavedSides',
    'LongHairMiaWallace',
    'LongHairStraight',
    'LongHairStraight2',
    'LongHairStraightStrand',
    'ShortHairDreads01',
    'ShortHairDreads02',
    'ShortHairFrizzle',
    'ShortHairShaggyMullet',
    'ShortHairShortCurly',
    'ShortHairShortFlat',
    'ShortHairShortRound',
    'ShortHairShortWaved',
    'ShortHairSides',
    'ShortHairTheCaesar',
    'ShortHairTheCaesarSidePart'
  ],
  'accessoriesType': [
    'Blank',
    'Kurt',
    'Prescription01',
    'Prescription02',
    'Round',
    'Sunglasses',
    'Wayfarers'
  ],
  'hairColor': [
    'Auburn',
    'Black',
    'Blonde',
    'BlondeGolden',
    'Brown',
    'BrownDark',
    'PastelPink',
    'Platinum',
    'Red',
    'SilverGray'
  ],
  'facialHairType': [
    'Blank',
    'BeardMedium',
    'BeardLight',
    'BeardMagestic',
    'MoustacheFancy',
    'MoustacheMagnum'
  ],
  'facialHairColor': [
    'Auburn',
    'Black',
    'Blonde',
    'BlondeGolden',
    'Brown',
    'BrownDark',
    'Platinum',
    'Red'
  ],
  'clotheType': [
    'BlazerShirt',
    'BlazerSweater',
    'CollarSweater',
    'GraphicShirt',
    'Hoodie',
    'Overall',
    'ShirtCrewNeck',
    'ShirtScoopNeck',
    'ShirtVNeck'
  ],
  'clotheColor': [
    'Black',
    'Blue01',
    'Blue02',
    'Blue03',
    'Gray01',
    'Gray02',
    'Heather',
    'PastelBlue',
    'PastelGreen',
    'PastelOrange',
    'PastelRed',
    'PastelYellow',
    'Pink',
    'Red',
    'White'
  ],
  'eyeType': [
    'Close',
    'Cry',
    'Default',
    'Dizzy',
    'EyeRoll',
    'Happy',
    'Hearts',
    'Side',
    'Squint',
    'Surprised',
    'Wink',
    'WinkWacky'
  ],
  'eyebrowType': [
    'Angry',
    'AngryNatural',
    'Default',
    'DefaultNatural',
    'FlatNatural',
    'RaisedExcited',
    'RaisedExcitedNatural',
    'SadConcerned',
    'SadConcernedNatural',
    'UnibrowNatural',
    'UpDown',
    'UpDownNatural'
  ],
  'mouthType': [
    'Concerned',
    'Default',
    'Disbelief',
    'Eating',
    'Grimace',
    'Sad',
    'ScreamOpen',
    'Serious',
    'Smile',
    'Tongue',
    'Twinkle',
    'Vomit'
  ],
  'skinColor': [
    'Tanned',
    'Yellow',
    'Pale',
    'Light',
    'Brown',
    'DarkBrown',
    'Black'
  ]
}

const generateRandomAvatar = () => {

  // CODE TO GET ALL OPTIONS FROM GETAVATAAARS - now stored in const options
  // const selects = Array.from(document.getElementsByTagName('select'))
  // const obj = {}
  // selects.map(el => {
  //   const options = Array.from(el.children)
  //   obj[el.id] = options.map(option => option.innerText)
  // })

  const obj = options
  const randomAvatarProps = {}
  const keys = Object.keys(obj)
  
  keys.forEach(el => {
    const randomIndex = Math.floor(Math.random() * obj[el].length)
    randomAvatarProps[el] = obj[el][randomIndex]
  })
  
  let config = ''
  
  for (const key in randomAvatarProps){
    config += `&${key}=${randomAvatarProps[key]}`
  }
  
  return `https://avataaars.io/?avatarStyle=Circle${config}`
}

export default generateRandomAvatar