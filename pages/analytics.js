function renderAnalytics() {

return `

<div style="
padding:32px;
background:#0b0b0b;
color:white;
min-height:100%;
font-family:Inter,sans-serif;
">

    <h1 style="
    font-size:42px;
    font-weight:600;
    margin-bottom:8px;
    ">
        Your journey in numbers ✨
    </h1>

    <p style="
    color:#b7b7b7;
    font-size:18px;
    margin-bottom:28px;
    ">
        A glance at your planning life.
    </p>


    <div style="
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:18px;
    ">

        <div style="
        background:#111;
        border:1px solid #262626;
        border-radius:20px;
        padding:24px;
        ">

            <div style="font-size:15px;color:#999;">
                Planner
            </div>

            <div style="
            margin-top:12px;
            font-size:34px;
            font-weight:600;
            ">
                Pocket Planner
            </div>

        </div>


        <div style="
        background:#111;
        border:1px solid #262626;
        border-radius:20px;
        padding:24px;
        ">

            <div style="
            font-size:15px;
            color:#999;
            ">
                Last Updated
            </div>

            <div style="
            margin-top:14px;
            font-size:28px;
            color:#FFD369;
            ">
                20 July 2026
            </div>

            <div style="
            color:#888;
            margin-top:6px;
            ">
                08:45 PM
            </div>

        </div>





        <div style="
        background:#111;
        border-radius:20px;
        padding:24px;
        border:1px solid #262626;
        ">

            <div style="color:#999">
                Day Streak
            </div>

            <div style="
            font-size:64px;
            color:#ffb84d;
            font-weight:600;
            margin-top:10px;
            ">
                🔥18
            </div>

            <div style="color:#999">
                Keep going!
            </div>

        </div>




        <div style="
        background:#111;
        border-radius:20px;
        padding:24px;
        border:1px solid #262626;
        ">

            <div style="color:#999">
                Best Streak
            </div>

            <div style="
            font-size:64px;
            color:#B66DFF;
            font-weight:600;
            margin-top:10px;
            ">
                🏆42
            </div>

            <div style="color:#999">
                Your all time best
            </div>

        </div>



        <div style="
        grid-column:1/-1;
        background:#111;
        border-radius:20px;
        border:1px solid #262626;
        padding:26px;
        ">

            <div style="
            font-size:32px;
            margin-bottom:18px;
            ">
                📈 Year Overview
            </div>

            <div style="
            height:260px;
            border-radius:16px;
            background:#181818;
            display:flex;
            align-items:center;
            justify-content:center;
            color:#777;
            ">
                Line Graph Here
            </div>

        </div>




        <div style="
        background:#111;
        border-radius:20px;
        padding:24px;
        border:1px solid #262626;
        ">

            <div style="
            font-size:28px;
            ">
                👑 Most Used Planner
            </div>

            <div style="
            font-size:40px;
            color:#B66DFF;
            margin-top:18px;
            ">
                Study Log
            </div>

            <div style="
            color:#999;
            margin-top:8px;
            ">
                Used 22 days this month
            </div>

        </div>




        <div style="
        background:#111;
        border-radius:20px;
        padding:24px;
        border:1px solid #262626;
        ">

            <div style="
            font-size:28px;
            ">
                🌱 Planner Age
            </div>

            <div style="
            font-size:56px;
            color:#88D66C;
            margin-top:18px;
            ">
                124
            </div>

            <div style="
            color:#999;
            ">
                Days since first use
            </div>

        </div>




        <div style="
        grid-column:1/-1;
        background:#111;
        border-radius:20px;
        padding:24px;
        border:1px solid #262626;
        ">

            <div style="
            font-size:32px;
            margin-bottom:20px;
            ">
                📅 Planner Activity
            </div>

            <div style="
            height:280px;
            background:#181818;
            border-radius:16px;
            display:flex;
            align-items:center;
            justify-content:center;
            color:#777;
            ">
                Heatmap Here
            </div>

        </div>

    </div>

</div>

`;

}