/**
 * The RA (Religious Advisor) cheat sheet: the circle ceremony, one step per page.
 *
 * This is the DeMon H3 running order, written by its RA. Other kennels will want
 * their own (see "Custom Hymnals" in the plan); until then this is the default.
 * Words in [brackets] are cues for the RA, not lines to say.
 * `moment` links a step to a Circle moment, which gives the step its song button.
 */

export type Circle = 'start' | 'end';

export type RaPrompt = {
  /** Short cue shown as a tag above the line, such as "If present". */
  cue?: string;
  text: string;
};

export type RaStep = {
  /** Stable id, used to remember the favourite song. Never rename once shipped. */
  id: string;
  circle: Circle;
  title: string;
  blurb: string;
  prompts: RaPrompt[];
  /** Moment id from content/moments.yml. Steps without one have no song. */
  moment?: string;
  /** How the song button names the song: "Pick your <songLabel> song". */
  songLabel?: string;
};

export const CIRCLE_NAMES: Record<Circle, string> = { start: 'Starting circle', end: 'Ending circle' };

export const raSteps: RaStep[] = [
  // --- Starting circle ---
  {
    id: 'start-greeting',
    circle: 'start',
    title: 'Greeting',
    blurb: 'Get everyone in a circle and kick things off.',
    prompts: [{ text: 'Circle up! Welcum to DeMon H3 #X!' }],
  },
  {
    id: 'start-first-cummers',
    circle: 'start',
    title: 'First cummers',
    blurb: 'Pull the newcomers into the middle and find out who they are.',
    prompts: [
      {
        text: 'I see some new faces tonight! If you’ve never been to a DeMon H3 trail before, or if you’ve never been to ANY hash house harrier trails before, please get in the circle!',
      },
      { cue: 'For each', text: 'Who RU? Who made you cum? Where RU from?' },
      {
        text: 'Welcum to DeMon H3! At the end of this trail we’re going to bring you back into circle to ask you to entertain us! While you’re out finding trail tonight, think of a short joke, a short song, or even a short body part to share that might be entertaining to us!',
      },
    ],
  },
  {
    id: 'start-introductions',
    circle: 'start',
    title: 'Introductions',
    blurb: 'Introduce yourself, go round the circle, then send the visitors out.',
    prompts: [
      { text: 'Now that we know who you are, we’re going to tell you who we are! I am your Champ, Harry Squatter!' },
      { cue: 'Point around circle', text: 'Alright, visitors, get the fuck out of my circle, virgins stay in!' },
    ],
  },
  {
    id: 'start-chaperones',
    circle: 'start',
    title: 'Chaperones',
    blurb: 'Give every virgin a chaperone for trail.',
    prompts: [
      { text: 'Can we please have a volunteer chaperone for X? Otherwise someone will be voluntold!' },
      { text: 'Chaperones, this virgin’s life is now in your hands, please make sure they make it back to us!' },
    ],
  },
  {
    id: 'start-chalk-talk',
    circle: 'start',
    title: 'Chalk talk',
    blurb: 'Run through every trail mark so nobody gets lost.',
    prompts: [
      { text: 'Mark, check, 369 hash degrees, on 1, on 2, ON ON.' },
      {
        text: 'False, Back Check, Trail Arrow, True Trail, Pack Marks, Whichy Way, Turkey/Eagle (Tough/Easy), Danger Can, etc.',
      },
    ],
  },
  {
    id: 'start-naming',
    circle: 'start',
    title: 'Naming candidates',
    blurb: 'Flag anyone up for a name tonight, so the pack can dig for material on trail.',
    prompts: [
      { cue: 'If anyone is ready', text: 'We’re going to try to come up with a name for Just X at circle later.' },
      { text: 'Consider chatting with them on trail and seeing if you can get some good name inspiration!' },
    ],
  },
  {
    id: 'start-on-out',
    circle: 'start',
    title: 'On out',
    blurb: 'Give the pack a heads up, then send them off.',
    prompts: [{ text: '69 second notice!' }, { text: 'ON OUT!' }],
  },

  // --- Ending circle ---
  {
    id: 'end-hares',
    circle: 'end',
    title: 'Hares',
    blurb: 'Circle up, hear what the pack thought of trail, then down-down the hares.',
    moment: 'hares',
    songLabel: 'hare',
    prompts: [
      { text: 'Circle up! Welcome again to the X running of the Demon Hash House Harriers!' },
      { cue: 'Go around or all at once', text: 'What did everyone think of trail today!' },
      {
        text: 'Wow! That sounds pretty shitty to me! Let’s get the hares into circle for their down down. Hares, what’s your excuse? A song for them?',
      },
      { cue: 'After the song', text: 'Alright, hares get the fuck out of circle!' },
    ],
  },
  {
    id: 'end-virgins',
    circle: 'end',
    title: 'Virgins',
    blurb: 'Bring the virgins back in, hear what they brought to entertain you, then teach them their first down-down.',
    moment: 'virgin',
    songLabel: 'virgin',
    prompts: [
      {
        cue: 'If present',
        text: 'Can we get our virgins back in circle? Who RU again? Did you have a good time? RU going to cum back?',
      },
      { text: 'Before trail we told you that we were going to ask you to entertain us at the end, so what have you brought us?' },
      { text: 'Can we get these virgins’ chaperones into the circle as well? They’re going to teach you the art of a down down.' },
      { text: 'Notice how there’s nothing on their head… There’s nothing in their head…' },
      {
        text: 'We’re going to sing you a song. When you hear the words down, down, down, you put your cups to your lips, you sip your beverage, and when you’re done, you put your cup to the top of your head to prove it’s empty.',
      },
      { cue: 'After the song', text: 'We hope you cum again, and again, and again… Now out of the circle.' },
    ],
  },
  {
    id: 'end-visitors',
    circle: 'end',
    title: 'Visitors',
    blurb: 'Bring the visitors back in and make them earn their beer.',
    moment: 'visitor',
    songLabel: 'visitor',
    prompts: [
      { text: 'Can we get our visitors back in the circle. Who RU again?' },
      { text: 'Do you have a joke, song or body part to share with us tonight?' },
    ],
  },
  {
    id: 'end-frb',
    circle: 'end',
    title: 'FRB',
    blurb: 'Call out the front-running bastard and sign them up to hare.',
    moment: 'fastest-runner',
    songLabel: 'FRB',
    prompts: [
      { text: 'Who was our FRB today? Can you please cum into circle with me?' },
      { text: 'Why were U so fast today? Well, speed racer, demon on wheels, what are you doing on X?' },
      { cue: 'If nothing', text: 'Wrong! You are haring that day!' },
      {
        cue: 'If busy',
        text: 'Okay, what’s the next Monday you are free? Great! Thank you for volunteering to hare!',
      },
      { text: 'Do we have a song for our FRB?' },
    ],
  },
  {
    id: 'end-accusations',
    circle: 'end',
    title: 'Accusations',
    blurb: 'Open the floor for crimes, accolades and tales from trail.',
    moment: 'accusations',
    songLabel: 'accusation',
    prompts: [{ text: 'Do we have any accusations, accolades, or tales from trail?' }],
  },
  {
    id: 'end-birthdays',
    circle: 'end',
    title: 'Hashy birthdays',
    blurb: 'Birthdays and anniversaries get dragged into the middle.',
    moment: 'birthday',
    songLabel: 'birthday',
    prompts: [{ text: 'Does anybody have a birthday or anniversary we’ve cruelly forgotten all about?' }],
  },
  {
    id: 'end-backsliders',
    circle: 'end',
    title: 'Backsliders',
    blurb: 'Anyone who missed the last two or more hashes owes the circle.',
    moment: 'returner',
    songLabel: 'backslider',
    prompts: [{ text: 'Do we have any backsliders this week? Has anyone missed the last two or more hashes?' }],
  },
  {
    id: 'end-announcements',
    circle: 'end',
    title: 'Announcements',
    blurb: 'Next trails and anything else the pack needs to know.',
    prompts: [{ text: 'When’s our next hash? Next MoA2 hash? Any other announcements?' }],
  },
  {
    id: 'end-peace',
    circle: 'end',
    title: 'May the hash go in peace',
    blurb: 'Close out the circle.',
    moment: 'closing',
    songLabel: 'closing',
    prompts: [{ text: 'May the hash go in peace!' }, { cue: 'The pack answers', text: 'May the hash get a piece!' }],
  },
];
