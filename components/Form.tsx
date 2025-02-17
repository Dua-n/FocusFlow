import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { QrCodeIcon } from "lucide-react";
import { useState } from "react";
import Scanner from './Scanner';
import { useToast } from "@/components/ui/use-toast"

const FormSchema = z.object({
  action: z.enum(["send", "receive"]),
  shitcoin: z.enum(["USDCETH", "USDTETH", "USDCTRX", "USDTTRX"]),
  amount: z.number().min(0),
  address: z.string(),
});

export default function ExchangeForm() {
  const [scanning, setScanning] = useState(false);

  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      action: "send",
      shitcoin: "USDCETH",
      amount: 0,
      address: "",
    },
  });

  const onSubmit = (e: any) => {
    console.log(e);
  };

  return (
    <div className="flex border border-border rounded-lg flex-col p-4 min-w-[280px]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={`flex flex-col gap-4 ${scanning ? 'hidden' : ''}`}
        >
          <span className="font-semibold">Lightning &lt;&gt; Sh*tcoin exchange</span>

          <FormField
            control={form.control}
            name="action"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Action</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Action" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="send">Send</SelectItem>
                    <SelectItem value="receive">Receive</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shitcoin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shitcoin / Cryptocurrency (same thing)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Action" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USDCETH">USDCETH</SelectItem>
                    <SelectItem value="USDTETH">USDTETH</SelectItem>
                    <SelectItem value="USDCTRX">USDCTRX</SelectItem>
                    <SelectItem value="USDTTRX">USDTTRX</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <Input
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  placeholder="69420"
                  type="number"
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <Input
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="0xAb5801a7D398351b8bE11C439..."
                />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="button" size="icon" variant="outline" onClick={() => setScanning(true)}>
                    <QrCodeIcon className="w-6 h-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="text-sm">Scan QR Code</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button type="submit" className="grow">
              Submit
            </Button>
          </div>
        </form>
        {scanning ? <Scanner stopScanning={() => setScanning(false)} onResult={(data) => {
          toast({
            title: 'Success!',
            description: data.getText()
          })
        }} /> : null}
      </Form>
    </div>
  );
}
