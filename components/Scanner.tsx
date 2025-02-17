import { QrReader } from 'react-qr-reader';
import { Button } from './ui/button';
import { Result } from '@zxing/library';

export default function Scanner({
  onResult,
  stopScanning
}: {
  onResult: (data: Result) => void;
  stopScanning: () => void;
}) {
  return <div className="flex flex-col gap-2">
    <QrReader
      onResult={(result, error) => {
        // Is called on an interval basis, so ignoring it
        if (error || !result) {
          return;
        }

        if (result) {
          onResult(result);
          stopScanning();
        }
      }}
      className="rounded w-full border"
      constraints={{ facingMode: 'user' }}
    />
    <Button onClick={stopScanning}>Cancel</Button>
  </div>
}