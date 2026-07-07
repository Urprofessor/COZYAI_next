import type { Step } from './types';

// Source of truth for the 7-step setup + tips. Migrated 1:1 from the vanilla
// project's `STEPS` array in index.html. Keep tips ordered — tip index i
// corresponds to /tips/(i+1).

export const STEPS: Step[] = [
  {
    num: 1,
    title: 'Unbox & Inspect',
    subtitle: 'Confirm all accessories are included',
    videoTitle: 'Unbox & Inspect',
    videoSub:
      '1. Open the box carefully and lay out all parts. Verify each accessory against the checklist before continuing.',
    tips: [
      {
        type: 'image',
        icon: 'question',
        title: "What's in the box",
        body:
          "Inside the box, you'll find your Air One pump units, charging accessories, flange inserts, sizing tools, and setup guides.\nPlace all components on a clean surface and confirm everything is included before setup.",
        image: '/images/steps/01-unbox-inspect/tips1.png',
      },
      {
        type: 'text',
        icon: 'alert',
        title: 'Missing or damaged parts?',
        body:
          'If any part is missing or appears damaged, please contact Momcozy Support.\nHaving your order number ready will help us assist you faster.\n• WhatsApp: +1 (619) 848-0676\n• Email: support@momcozy.com.',
      },
    ],
  },
  {
    num: 2,
    title: 'Measure Flange Size',
    subtitle: 'Find the size that fits you',
    videoTitle: 'Measure Flange Size',
    videoSub:
      '2. Measure your nipple diameter and match it to the correct flange size.',
    tips: [
      {
        type: 'image',
        icon: 'question',
        title: 'Sizing guide',
        body:
          'Use the included measuring tool to measure the base of your nipple — not the areola. Measure after stimulation when the nipple is fully extended for the most accurate result.\nA correct fit allows the nipple to move freely in the tunnel without rubbing or pulling too much areola inside.',
        image: '/images/steps/02-measure-flange/step2tips2.png',
      },
      {
        type: 'image',
        icon: 'question',
        title: 'Choose your flange size',
        body:
          'Match your measurement to the closest flange insert size. If you are between sizes, start with the smaller option.',
        warning:
          'Your nipple size may change over time with regular pumping or different stages of breastfeeding. Re-measuring occasionally can help maintain a comfortable and effective fit.',
        image: '/images/steps/02-measure-flange/step2tips3.png',
      },
    ],
  },
  {
    num: 3,
    title: 'Disassemble Parts',
    subtitle: 'Take it apart in order',
    videoTitle: 'Disassemble Parts',
    videoSub:
      '3. Detach the flange, milk collector, diaphragm, and valve in the order shown.',
    tips: [
      {
        type: 'carousel',
        icon: 'question',
        title: 'Disassembly sequence',
        sharedIntro:
          'Follow the steps below to safely separate the washable parts from the motor unit before cleaning.',
        frameHeight: 173,
        slides: [
          { image: '/images/steps/03-disassemble/step3tips1.png', caption: 'Detach the flange from the pump motor' },
          { image: '/images/steps/03-disassemble/step3tips2.png', caption: 'Hold the protruding part and separate the milk collector from the main unit' },
          { image: '/images/steps/03-disassemble/step3tips3.png', caption: 'Remove the suction cup from the milk collector' },
          { image: '/images/steps/03-disassemble/step3tips4.png', caption: 'Disassemble the milk collector' },
          { image: '/images/steps/03-disassemble/step3tips5.png', caption: 'Separate the valve' },
        ],
      },
    ],
  },
  {
    num: 4,
    title: 'Clean & Sanitize',
    subtitle: 'Wash all washable parts',
    videoTitle: 'Clean & Sanitize',
    videoSub: '4. Wash all parts thoroughly and let them air-dry.',
    tips: [
      {
        type: 'image',
        icon: 'question',
        title: 'Washable and Non-Washable Parts',
        body:
          'The pump motor is a non-washable component. Do not wash or sterilize it with water. The pump accessories are washable components. After use, rinse them with clean water and allow them to air dry completely.',
        image: '/images/steps/04-clean-sanitize/step4tips1.png',
      },
      {
        type: 'image',
        icon: 'question',
        title: 'Cleaning and Sterilization Methods',
        body:
          'First rinse all components with clean water, then choose either boiling sterilization or microwave steam sterilizer bags for sterilization. During sterilization, avoid components touching the pot edges and other high-temperature areas. It is recommended to sterilize once daily.',
        image: '/images/steps/04-clean-sanitize/step4tips2.png',
      },
    ],
  },
  {
    num: 5,
    title: 'Assemble the Pump',
    subtitle: 'Snap the parts together',
    videoTitle: 'Assemble the Pump',
    videoSub:
      '5. Install the valve, fit the diaphragm, then connect everything to the main unit.',
    tips: [
      {
        type: 'carousel',
        icon: 'question',
        title: 'Assembly sequence',
        sharedIntro:
          'Follow the steps below to reassemble the washable parts and prepare the pump for use.',
        frameHeight: 173,
        slides: [
          { image: '/images/steps/05-assemble/step5tips1.png', caption: 'Push the duckbill valve firmly into the collector base.' },
          { image: '/images/steps/05-assemble/step5tips2.png', caption: 'Attach the collector cover and make sure both sides are aligned correctly.' },
          { image: '/images/steps/05-assemble/step5tips3.png', caption: 'Install the silicone diaphragm and press the cap firmly into place.' },
          { image: '/images/steps/05-assemble/step5tips4.png', caption: 'Press the assembled collector onto the main unit until secure.' },
          { image: '/images/steps/05-assemble/step5tips5.png', caption: 'Attach the flange firmly and make sure the correct size is installed.' },
        ],
      },
    ],
  },
  {
    num: 6,
    title: 'Wear It Right',
    subtitle: 'Position for a good seal',
    videoTitle: 'Wear It Right',
    videoSub: '6. Slip the pump into your bra and check the seal.',
    tips: [
      {
        type: 'image',
        icon: 'question',
        title: 'Center and align the flange',
        body:
          'Center your nipple inside the flange tunnel and keep the pump sitting flat against the breast.\nIf the pump tilts or gaps appear around the flange, reposition it before pumping.',
        images: [
          '/images/steps/06-wear/step6tips1-1.png',
          '/images/steps/06-wear/step6tips1-2.png',
        ],
      },
      {
        type: 'image',
        icon: 'question',
        title: 'Wear securely inside your bra',
        body:
          'Place the assembled pump inside a supportive nursing bra and adjust until it feels secure and balanced.\nA proper fit should feel gentle, stable, and evenly sealed during pumping.\nIf you hear air leakage or lose suction, reposition the pump and check that all parts are fully assembled.',
        image: '/images/steps/06-wear/step6tips2.png',
      },
    ],
  },
  {
    num: 7,
    title: 'First Session',
    subtitle: 'Begin pumping',
    videoTitle: 'First Session',
    videoSub: '7. Connect via the app and start your first session.',
    tips: [
      {
        type: 'image',
        icon: 'question',
        title: 'Learn the control button',
        body:
          'Use the control buttons to switch modes, adjust suction levels, pause pumping, and check battery status.\nAir One begins in stimulation mode with light, fast suction to help trigger letdown.',
        image: '/images/steps/07-first-session/step7tips1.png',
      },
      {
        type: 'image',
        icon: 'alert',
        title: 'Pour milk slowly',
        body:
          'Keep the flange upright while pouring milk into a storage bottle or bag.\nAvoid tilting the pump too quickly to help prevent spills and leakage.',
        image: '/images/steps/07-first-session/step7tips3.png',
      },
    ],
  },
];

// Cover images used on the tips index (short summary card blurb).
export const TIP_INDEX: Array<{ title: string; blurb: string; icon: string }> = [
  { title: 'Unbox & Inspect', blurb: 'Meet all parts.', icon: '/icon/tips1.png' },
  { title: 'Measure Flange Size', blurb: 'Find your perfect fit.', icon: '/icon/tips2.png' },
  { title: 'Disassemble Parts', blurb: 'Take it apart safely.', icon: '/icon/tips3.png' },
  { title: 'Clean & Sanitize', blurb: 'Keep every part clean.', icon: '/icon/tips4.png' },
  { title: 'Assemble the Pump', blurb: 'Put it all together.', icon: '/icon/tips5.png' },
  { title: 'Wear It Right', blurb: 'Position and seal correctly.', icon: '/icon/tips6.png' },
  { title: 'First Session', blurb: 'Connect and start pumping.', icon: '/icon/tips7.png' },
];
