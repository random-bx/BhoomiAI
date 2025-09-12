import React from 'react';
import { motion, useSpring, useInView } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Leaf } from 'lucide-react';

// Define the shape of the prediction data passed as props
interface PredictionResultData {
  predictedYield: number;
  recommendations: string;
}

// Animated number component
const AnimatedNumber = ({ value }: { value: number }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { stiffness: 50, damping: 20 });

  React.useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  return <motion.span ref={ref}>{spring.to((val) => val.toFixed(2))}</motion.span>;
};

const PredictionResult: React.FC<{ data: PredictionResultData }> = ({ data }) => {
  const chartData = [
    { name: 'State Average', yield: 2100 },
    { name: 'Your Prediction', yield: data.predictedYield },
  ];

  return (
    <motion.div
      className="col-span-1 lg:col-span-3 grid md:grid-cols-2 gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Result Card */}
      <Card>
        <CardHeader>
          <CardTitle>Prediction Result</CardTitle>
          <CardDescription>This season looks promising 🌾!</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">Estimated Yield</p>
          <p className="text-6xl font-bold text-primary">
            <AnimatedNumber value={data.predictedYield} />
          </p>
          <p className="text-muted-foreground">kg/hectare</p>
        </CardContent>
      </Card>

      {/* Recommendations Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-500" />
            <span>AI Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-line">{data.recommendations}</p>
        </CardContent>
      </Card>
      
       {/* Chart Card */}
       <Card className="md:col-span-2">
         <CardHeader>
           <CardTitle>Yield Comparison</CardTitle>
         </CardHeader>
         <CardContent>
           <ResponsiveContainer width="100%" height={200}>
             <BarChart data={chartData} layout="vertical">
               <XAxis type="number" hide />
               <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={100} />
               <Tooltip cursor={{fill: 'transparent'}}/>
               <Bar dataKey="yield" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
             </BarChart>
           </ResponsiveContainer>
         </CardContent>
       </Card>
    </motion.div>
  );
};

export default PredictionResult;