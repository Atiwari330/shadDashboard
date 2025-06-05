'use client';

import * as React from 'react';
import { IconTrendingUp } from '@tabler/icons-react';
import { Label, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const chartData = [
  { browser: 'provider_referral', visitors: 275, fill: 'var(--primary)' },
  { browser: 'insurance', visitors: 200, fill: 'var(--primary-light)' },
  { browser: 'online_search', visitors: 287, fill: 'var(--primary-lighter)' },
  { browser: 'social_media', visitors: 173, fill: 'var(--primary-dark)' },
  { browser: 'other', visitors: 190, fill: 'var(--primary-darker)' }
];

const chartConfig = {
  visitors: {
    label: 'Inquiries'
  },
  provider_referral: {
    label: 'Provider Referral',
    color: 'var(--primary)'
  },
  insurance: {
    label: 'Insurance',
    color: 'var(--primary)'
  },
  online_search: {
    label: 'Online Search',
    color: 'var(--primary)'
  },
  social_media: {
    label: 'Social Media',
    color: 'var(--primary)'
  },
  other: {
    label: 'Other',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export function PieGraph() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Referral Sources Distribution</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            Patient inquiry sources for the last 6 months
          </span>
          <span className='@[540px]/card:hidden'>Referral sources</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square h-[250px]'
        >
          <PieChart>
            <defs>
              {[
                'provider_referral',
                'insurance',
                'online_search',
                'social_media',
                'other'
              ].map((browser, index) => (
                <linearGradient
                  key={browser}
                  id={`fill${browser}`}
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop
                    offset='0%'
                    stopColor='var(--primary)'
                    stopOpacity={1 - index * 0.15}
                  />
                  <stop
                    offset='100%'
                    stopColor='var(--primary)'
                    stopOpacity={0.8 - index * 0.15}
                  />
                </linearGradient>
              ))}
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData.map((item) => ({
                ...item,
                fill: `url(#fill${item.browser})`
              }))}
              dataKey='visitors'
              nameKey='browser'
              innerRadius={60}
              strokeWidth={2}
              stroke='var(--background)'
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground text-sm'
                        >
                          Total Inquiries
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          Provider Referral leads with{' '}
          {((chartData[0].visitors / totalVisitors) * 100).toFixed(1)}%{' '}
          <IconTrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Based on data from January - June 2024
        </div>
      </CardFooter>
    </Card>
  );
}
