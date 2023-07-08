import { Dec } from "@keplr-wallet/unit";
import classNames from "classnames";
import React, { FunctionComponent } from "react";
import { useTranslation } from "react-multi-lang";

import { CustomClasses } from "~/components/types";

const enum PositionStatus {
  InRange,
  NearBounds,
  OutOfRange,
  FullRange,
  SuperfluidStaked,
  SuperfulidUnstaking,
}
export const MyPositionStatus: FunctionComponent<
  {
    currentPrice: Dec;
    lowerPrice: Dec;
    upperPrice: Dec;
    negative?: boolean;
    fullRange?: boolean;
    isSuperfluid?: boolean;
    isSuperfluidUnstaking?: boolean;
  } & CustomClasses
> = ({
  className,
  currentPrice,
  lowerPrice,
  upperPrice,
  negative,
  fullRange,
  isSuperfluid,
  isSuperfluidUnstaking,
}) => {
  const t = useTranslation();

  const inRange = lowerPrice.lt(currentPrice) && upperPrice.gt(currentPrice);

  const diff = new Dec(
    Math.min(
      Number(currentPrice.sub(lowerPrice).toString()),
      Number(upperPrice.sub(currentPrice).toString())
    )
  );

  const diffPercentage = currentPrice.isZero()
    ? new Dec(0)
    : diff.quo(currentPrice).mul(new Dec(100));

  let label, status;

  if (inRange) {
    if (diffPercentage.lte(new Dec(10))) {
      status = PositionStatus.NearBounds;
      label = t("clPositions.nearBounds");
    } else {
      status = PositionStatus.InRange;
      label = t("clPositions.inRange");
    }
  } else {
    status = PositionStatus.OutOfRange;
    label = t("clPositions.outOfRange");
  }

  if (fullRange) {
    status = PositionStatus.FullRange;
    label = t("clPositions.fullRange");
  }

  if (isSuperfluid) {
    status = PositionStatus.SuperfluidStaked;
    label = t("clPositions.superfluidStaked");
  }

  if (isSuperfluidUnstaking) {
    status = PositionStatus.SuperfulidUnstaking;
    label = t("clPositions.superfluidUnstakingStatus");
  }

  return (
    <div
      className={classNames(
        "flex w-fit items-center gap-[10px] rounded-[12px] px-3 py-1",
        {
          "bg-bullish-600/30": !negative && status === PositionStatus.InRange,
          "bg-ammelia-600/30":
            !negative && status === PositionStatus.NearBounds,
          "bg-rust-600/30": !negative && status === PositionStatus.OutOfRange,
          "bg-[#2994D04D]/30": !negative && status === PositionStatus.FullRange,
          "bg-superfluid/30":
            !negative &&
            (status === PositionStatus.SuperfluidStaked ||
              status === PositionStatus.SuperfulidUnstaking),
        },
        className
      )}
    >
      <div
        className={classNames("h-3 w-3 rounded-full", {
          "bg-bullish-500": status === PositionStatus.InRange,
          "bg-ammelia-600": status === PositionStatus.NearBounds,
          "bg-rust-500": status === PositionStatus.OutOfRange,
          "bg-ion-400": status === PositionStatus.FullRange,
          "bg-superfluid":
            status === PositionStatus.SuperfluidStaked ||
            status === PositionStatus.SuperfulidUnstaking,
        })}
      />
      <span className="subtitle1">{label}</span>
    </div>
  );
};
