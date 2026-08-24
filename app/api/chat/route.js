import { NextResponse } from "next/server";

const PRESET_SEATING = [
  18, 14, 28, 17, 4,
  12, 27, 20, 23, 9,
  15, 1, 25, 24, 22, 26,
  16, 5, 3, 21, 13, 19,
  8, 6, 29, 2, 10, 7
];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function POST(req) {
  try {
    const { totalStudents, isRigged } = await req.json();

    let assignedSeats = [];

    if (isRigged) {
      const validPreset = PRESET_SEATING.filter((studentNum) =>
        totalStudents.includes(studentNum)
      );
      const missingStudents = totalStudents.filter(
        (studentNum) => !PRESET_SEATING.includes(studentNum)
      );
      assignedSeats = [...validPreset, ...missingStudents];
    } else {
      assignedSeats = shuffle(totalStudents);
    }

    return NextResponse.json({
      success: true,
      mode: isRigged ? "rigged" : "random",
      assignments: assignedSeats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "배치 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
