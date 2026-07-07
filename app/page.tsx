import { MyDevicePage } from '@/components/device/MyDevicePage';

// Root / — the "My Device" hub. Tapping "Get Start" on the Breast Pump card
// navigates to /welcome (the onboarding intro), which then flows into /setup/1.
export default function Home() {
  return <MyDevicePage />;
}
