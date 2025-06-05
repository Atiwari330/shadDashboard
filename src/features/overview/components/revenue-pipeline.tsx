'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  IconArrowRight,
  IconClock,
  IconAlertTriangle
} from '@tabler/icons-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import {
  generateMockPipelineData,
  formatCurrency,
  formatNumber,
  type RevenuePipelineData,
  type PipelineStage,
  type StageDetails,
  type Lead
} from '../types/pipeline.types';

export function RevenuePipeline() {
  const [pipelineData, setPipelineData] =
    React.useState<RevenuePipelineData | null>(null);
  const [isClient, setIsClient] = React.useState(false);
  const [selectedStage, setSelectedStage] = React.useState<{
    stage: PipelineStage;
    details: StageDetails;
  } | null>(null);
  const [selectedLeads, setSelectedLeads] = React.useState<{
    leads: Lead[];
    type: 'stuck' | 'at-risk';
    stageName: string;
  } | null>(null);

  React.useEffect(() => {
    setIsClient(true);
    setPipelineData(generateMockPipelineData());
  }, []);

  if (!isClient || !pipelineData) {
    return <PipelineSkeleton />;
  }

  return (
    <TooltipProvider>
      <Card className='@container/pipeline'>
        <CardHeader>
          <CardTitle>Revenue Pipeline</CardTitle>
        </CardHeader>
        <CardContent className='px-2 sm:px-6'>
          {/* Desktop Layout */}
          <div className='hidden @[1024px]/pipeline:block'>
            <div className='flex items-center'>
              {pipelineData.stages.map((stage, index) => (
                <React.Fragment key={stage.id}>
                  <div className='flex-1'>
                    <PipelineStageCard
                      stage={stage}
                      stageDetails={pipelineData.stageDetails[stage.id]}
                      isLast={index === pipelineData.stages.length - 1}
                      onClick={() =>
                        setSelectedStage({
                          stage,
                          details: pipelineData.stageDetails[stage.id]
                        })
                      }
                      onBadgeClick={(type: 'stuck' | 'at-risk') => {
                        const details = pipelineData.stageDetails[stage.id];
                        const leads =
                          type === 'stuck'
                            ? details.stuckLeadsList
                            : details.atRiskLeadsList;
                        if (leads && leads.length > 0) {
                          setSelectedLeads({
                            leads,
                            type,
                            stageName: stage.name
                          });
                        }
                      }}
                    />
                  </div>
                  {/* Connector between stages */}
                  {index < pipelineData.stages.length - 1 && (
                    <PipelineConnector
                      conversionRate={
                        pipelineData.conversionRates.find(
                          (cr) => cr.fromStageId === stage.id
                        )?.rate || 0
                      }
                      fromStage={stage.name}
                      toStage={pipelineData.stages[index + 1].name}
                      isVertical={false}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className='@[1024px]/pipeline:hidden'>
            <div className='grid grid-cols-1 gap-2 @[540px]/pipeline:grid-cols-2 @[540px]/pipeline:gap-4'>
              {pipelineData.stages.map((stage, index) => (
                <React.Fragment key={stage.id}>
                  <PipelineStageCard
                    stage={stage}
                    stageDetails={pipelineData.stageDetails[stage.id]}
                    isLast={index === pipelineData.stages.length - 1}
                    onClick={() =>
                      setSelectedStage({
                        stage,
                        details: pipelineData.stageDetails[stage.id]
                      })
                    }
                    onBadgeClick={(type: 'stuck' | 'at-risk') => {
                      const details = pipelineData.stageDetails[stage.id];
                      const leads =
                        type === 'stuck'
                          ? details.stuckLeadsList
                          : details.atRiskLeadsList;
                      if (leads && leads.length > 0) {
                        setSelectedLeads({
                          leads,
                          type,
                          stageName: stage.name
                        });
                      }
                    }}
                  />
                  {/* Vertical connector for mobile, skip on 2-column layout */}
                  {index < pipelineData.stages.length - 1 && (
                    <div className='flex justify-center py-1 @[540px]/pipeline:hidden'>
                      <PipelineConnector
                        conversionRate={
                          pipelineData.conversionRates.find(
                            (cr) => cr.fromStageId === stage.id
                          )?.rate || 0
                        }
                        fromStage={stage.name}
                        toStage={pipelineData.stages[index + 1].name}
                        isVertical={true}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stage Details Dialog */}
      <Dialog
        open={!!selectedStage}
        onOpenChange={(open) => !open && setSelectedStage(null)}
      >
        {selectedStage && (
          <StageDetailsDialog
            stage={selectedStage.stage}
            details={selectedStage.details}
          />
        )}
      </Dialog>

      {/* Lead List Dialog */}
      <Dialog
        open={!!selectedLeads}
        onOpenChange={(open) => !open && setSelectedLeads(null)}
      >
        {selectedLeads && (
          <LeadListDialog
            leads={selectedLeads.leads}
            type={selectedLeads.type}
            stageName={selectedLeads.stageName}
          />
        )}
      </Dialog>
    </TooltipProvider>
  );
}

interface PipelineStageCardProps {
  stage: PipelineStage;
  stageDetails: RevenuePipelineData['stageDetails'][string];
  isLast: boolean;
  onClick?: () => void;
  onBadgeClick?: (type: 'stuck' | 'at-risk') => void;
}

function PipelineStageCard({
  stage,
  stageDetails,
  isLast,
  onClick,
  onBadgeClick
}: PipelineStageCardProps) {
  const hasIssues = stageDetails.stuckLeads > 0 || stageDetails.atRiskLeads > 0;

  return (
    <div className='group relative'>
      <Card
        className={cn(
          'bg-card hover:bg-accent/5 relative h-full cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg',
          isLast && 'bg-primary/5 dark:bg-primary/10'
        )}
        onClick={onClick}
      >
        <CardHeader className='space-y-1 pb-3'>
          <div className='flex items-start justify-between'>
            <h3 className='text-sm leading-none font-medium'>{stage.name}</h3>
            {hasIssues && (
              <div className='flex gap-1'>
                {stageDetails.stuckLeads > 0 && (
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant='outline'
                        className='hover:bg-accent h-6 cursor-pointer px-1.5 text-xs font-normal'
                        onClick={(e) => {
                          e.stopPropagation();
                          onBadgeClick?.('stuck');
                        }}
                      >
                        <IconClock className='mr-0.5' />
                        {stageDetails.stuckLeads}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {stageDetails.stuckLeads} leads stuck for over 48 hours
                      </p>
                      <p className='text-xs opacity-75'>
                        Click to view details
                      </p>
                    </TooltipContent>
                  </UITooltip>
                )}
                {stageDetails.atRiskLeads > 0 && (
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant='destructive'
                        className='h-6 animate-pulse cursor-pointer px-1.5 text-xs font-normal hover:brightness-90'
                        onClick={(e) => {
                          e.stopPropagation();
                          onBadgeClick?.('at-risk');
                        }}
                      >
                        <IconAlertTriangle className='mr-0.5' />
                        {stageDetails.atRiskLeads}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{stageDetails.atRiskLeads} high-value leads at risk</p>
                      <p className='text-xs opacity-75'>
                        Click to view details
                      </p>
                    </TooltipContent>
                  </UITooltip>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className='space-y-2 pt-0'>
          <div>
            <p className='text-2xl font-bold tabular-nums'>
              {formatCurrency(stage.value)}
            </p>
            <p className='text-muted-foreground text-sm'>
              {stage.count} leads • {formatNumber(stage.value / stage.count)}{' '}
              avg
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface PipelineConnectorProps {
  conversionRate: number;
  fromStage?: string;
  toStage?: string;
  isVertical?: boolean;
  className?: string;
}

function PipelineConnector({
  conversionRate,
  fromStage,
  toStage,
  isVertical = false,
  className
}: PipelineConnectorProps) {
  const isLowConversion = conversionRate < 50;
  const prefersReducedMotion = React.useReducer(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    false
  )[0];

  // Generate particles for flow animation
  const particles = React.useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => ({
        id: i,
        delay: i * 1.5
      })),
    []
  );

  if (isVertical) {
    return (
      <div className='relative flex h-12 items-center justify-center'>
        <div className='bg-border absolute h-full w-0.5' />
        {/* Flow particles */}
        {!prefersReducedMotion && (
          <div className='absolute h-full w-0.5 overflow-hidden'>
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className='bg-primary/50 absolute left-1/2 h-1 w-1 -translate-x-1/2 rounded-full'
                initial={{ top: -4 }}
                animate={{ top: '100%' }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: 'linear'
                }}
              />
            ))}
          </div>
        )}
        <UITooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'bg-background relative z-10 cursor-help rounded-full border px-2 py-1 text-xs font-medium',
                isLowConversion
                  ? 'border-destructive/50 text-destructive'
                  : 'border-border text-muted-foreground'
              )}
            >
              {conversionRate}%
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {fromStage} → {toStage}: {conversionRate}% conversion
              {isLowConversion && (
                <span className='text-destructive block'>
                  Below target (50%)
                </span>
              )}
            </p>
          </TooltipContent>
        </UITooltip>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative mx-2 flex w-16 items-center justify-center',
        className
      )}
    >
      <div className='bg-border absolute h-0.5 w-full' />
      {/* Flow particles */}
      {!prefersReducedMotion && (
        <div className='absolute h-0.5 w-full overflow-hidden'>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className='bg-primary/50 absolute top-1/2 h-1 w-1 -translate-y-1/2 rounded-full'
              initial={{ left: -4 }}
              animate={{ left: '100%' }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: particle.delay,
                ease: 'linear'
              }}
            />
          ))}
        </div>
      )}
      <IconArrowRight className='text-muted-foreground bg-background absolute right-0 size-4' />
      <UITooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'bg-background relative z-10 cursor-help rounded-full border px-2 py-0.5 text-xs font-medium',
              isLowConversion
                ? 'border-destructive/50 text-destructive'
                : 'border-border text-muted-foreground'
            )}
          >
            {conversionRate}%
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {fromStage} → {toStage}: {conversionRate}% conversion
            {isLowConversion && (
              <span className='text-destructive block'>Below target (50%)</span>
            )}
          </p>
        </TooltipContent>
      </UITooltip>
    </div>
  );
}

function PipelineSkeleton() {
  return (
    <Card className='@container/pipeline'>
      <CardHeader>
        <div className='bg-muted h-6 w-32 animate-pulse rounded' />
      </CardHeader>
      <CardContent className='px-2 sm:px-6'>
        <div className='grid grid-cols-1 gap-4 @[540px]/pipeline:grid-cols-2 @[1024px]/pipeline:grid-cols-4'>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className='h-[140px]'>
              <CardHeader className='space-y-1 pb-3'>
                <div className='bg-muted h-4 w-24 animate-pulse rounded' />
              </CardHeader>
              <CardContent className='space-y-2 pt-0'>
                <div className='bg-muted h-8 w-32 animate-pulse rounded' />
                <div className='bg-muted h-4 w-20 animate-pulse rounded' />
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Stage Details Dialog Component
interface StageDetailsDialogProps {
  stage: PipelineStage;
  details: StageDetails;
}

function StageDetailsDialog({ stage, details }: StageDetailsDialogProps) {
  const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const chartConfig = {
    value: {
      label: 'Value',
      color: 'var(--primary)'
    }
  } satisfies ChartConfig;

  return (
    <DialogContent className='max-h-[80vh] max-w-3xl overflow-hidden'>
      <DialogHeader>
        <DialogTitle>{stage.name} - Detailed Breakdown</DialogTitle>
        <DialogDescription>
          {formatCurrency(stage.value)} from {stage.count} leads
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue='insurance' className='mt-4'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='insurance'>Insurance Types</TabsTrigger>
          <TabsTrigger value='services'>Service Types</TabsTrigger>
          <TabsTrigger value='referrals'>Referral Sources</TabsTrigger>
        </TabsList>

        <ScrollArea className='mt-4 h-[400px]'>
          <TabsContent value='insurance' className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-base'>
                    Distribution by Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className='h-[250px]'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <PieChart>
                        <Pie
                          data={details.insuranceBreakdown}
                          dataKey='value'
                          nameKey='type'
                          cx='50%'
                          cy='50%'
                          outerRadius={80}
                          label={(entry) => `${entry.percentage}%`}
                        >
                          {details.insuranceBreakdown.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={
                            <ChartTooltipContent
                              formatter={(value) =>
                                formatCurrency(value as number)
                              }
                            />
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-base'>
                    Lead Count by Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    {details.insuranceBreakdown.map((item, index) => (
                      <div
                        key={item.type}
                        className='flex items-center justify-between'
                      >
                        <div className='flex items-center gap-2'>
                          <div
                            className='h-3 w-3 rounded-full'
                            style={{
                              backgroundColor:
                                CHART_COLORS[index % CHART_COLORS.length]
                            }}
                          />
                          <span className='text-sm'>{item.type}</span>
                        </div>
                        <div className='text-muted-foreground text-sm'>
                          {item.count} leads ({formatCurrency(item.value)})
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='services' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>
                  Services Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className='h-[300px]'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={details.serviceBreakdown}>
                      <XAxis
                        dataKey='service'
                        angle={-45}
                        textAnchor='end'
                        height={80}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip
                        content={
                          <ChartTooltipContent
                            formatter={(value) =>
                              formatCurrency(value as number)
                            }
                          />
                        }
                      />
                      <Bar
                        dataKey='value'
                        fill='var(--primary)'
                        radius={[4, 4, 0, 0]}
                      >
                        {details.serviceBreakdown.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='referrals' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>
                  Top Referral Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {details.referralSources.map((source) => (
                    <div key={source.source} className='space-y-1'>
                      <div className='flex items-center justify-between'>
                        <span className='text-sm font-medium'>
                          {source.source}
                        </span>
                        <span className='text-muted-foreground text-sm'>
                          {source.percentage}% ({source.count} leads)
                        </span>
                      </div>
                      <div className='bg-muted h-2 w-full rounded-full'>
                        <div
                          className='bg-primary h-2 rounded-full transition-all'
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                      <div className='text-muted-foreground text-xs'>
                        {formatCurrency(source.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </DialogContent>
  );
}

// Lead List Dialog Component
interface LeadListDialogProps {
  leads: Lead[];
  type: 'stuck' | 'at-risk';
  stageName: string;
}

function LeadListDialog({ leads, type, stageName }: LeadListDialogProps) {
  const title =
    type === 'stuck'
      ? `Stuck Leads in ${stageName}`
      : `At-Risk Leads in ${stageName}`;

  const description =
    type === 'stuck'
      ? 'Leads that have been idle for over 48 hours'
      : 'High-value leads that require immediate attention';

  return (
    <DialogContent className='max-h-[80vh] max-w-2xl overflow-hidden'>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <ScrollArea className='mt-4 h-[500px]'>
        <div className='space-y-3'>
          {leads.map((lead) => (
            <Card key={lead.id} className='p-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <div className='mb-2 flex items-center justify-between'>
                    <h4 className='font-medium'>{lead.name}</h4>
                    <Badge
                      variant={type === 'stuck' ? 'outline' : 'destructive'}
                    >
                      {type === 'stuck' ? (
                        <>
                          <IconClock className='mr-1 h-3 w-3' />
                          {lead.daysInStage} days
                        </>
                      ) : (
                        <>
                          <IconAlertTriangle className='mr-1 h-3 w-3' />
                          At Risk
                        </>
                      )}
                    </Badge>
                  </div>
                  <div className='space-y-1 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Value:</span>
                      <span className='font-medium'>
                        {formatCurrency(lead.value)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Insurance:</span>
                      <span>{lead.insuranceType}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Service:</span>
                      <span>{lead.service}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className='space-y-1 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Referral:</span>
                      <span>{lead.referralSource}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>
                        Assigned to:
                      </span>
                      <span>{lead.assignedTo}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>
                        Last contact:
                      </span>
                      <span>
                        {lead.lastContact
                          ? new Date(lead.lastContact).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                    {lead.riskReason && (
                      <div className='bg-destructive/10 text-destructive mt-2 rounded p-2 text-xs'>
                        {lead.riskReason}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </DialogContent>
  );
}
