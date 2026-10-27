import { NextResponse } from "next/server";

const PRESET_SEATING = [
  8, 19,
  23, 24, 20, 29, 4, 6,
  17, 27, 25, 12, 7, 14,
  21, 5, 3, 15, 28, 10,
  16, 13, 1, 22, 2, 18
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
