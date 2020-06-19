// export const allStatusOption = {
//   0: "取消",
//   1: "待通知",
//   2: "已通知",
//   3: "待清运",
//   4: "已清运",
//   5: "预交付",
//   6: "已交付",
//   7: "待审核"
// };

export enum allStatusOption {
  "取消",
  "待通知",
  "已通知",
  "待清运",
  "已清运",
  "预交付",
  "已交付",
  "待审核"
}

export const userOption = [
  {
    value: 1,
    label: "取证员"
  },
  {
    value: 2,
    label: "单车服务商"
  },
  {
    value: 3,
    label: "司机"
  },
  {
    value: 4,
    label: "门卫"
  },
  {
    value: 5,
    label: "清运审核员"
  }
];
