function renderAnalytics() {
  return `

<div class="analytics-page">

    <div class="analytics-header">

        <div class="analytics-title">
            <i data-lucide="chart-no-axes-combined"></i>
            <h1>Planner Analytics</h1>
        </div>

        <p>Explore your activity, trends, and planning habits.</p>
        

    </div>


    <div class="analytics-grid">

        <div class="analytics-card analytics-planner-card">

    <div class="planner-main">

        <div class="planner-left">

            <div class="planner-top">
                <span class="analytics-label">Planner</span>

                <button class="planner-edit">
                    <i data-lucide="pencil"></i>
                </button>
            </div>

            <div class="planner-name">
                Pocket Planner
            </div>

            <div class="planner-created">
                <i data-lucide="calendar"></i>
                Created on Dec 12, 2024
            </div>

        </div>


        <div class="planner-divider"></div>


        <div class="planner-right">

            <div class="planner-last">
                <i data-lucide="calendar-sync"></i>

                <div>
                    <div class="analytics-label">
                        Last Updated
                    </div>

                    <div class="planner-date">
                        20 July 2026
                    </div>

                    <div class="planner-time">
                        08:45 PM
                    </div>
                </div>

            </div>

        </div>

    </div>

</div>



  <div class="analytics-card">

    <div class="analytics-label">
        Day Streak
    </div>

    <div class="analytics-streak streak-fire">
        <i data-lucide="flame"></i>
        <span>18</span>
    </div>

    <div class="analytics-subtitle">
        Keep going! 2 more days to beat your best.
    </div>

    <div class="analytics-divider"></div>

    <div class="streak-insights">

        <div class="streak-item">

            <i data-lucide="calendar-days"></i>

            <div>

                <div class="streak-title">
                    Current streak
                </div>

                <div class="streak-value">
                    18 days
                </div>

            </div>

        </div>

        <div class="streak-item">

            <i data-lucide="flame"></i>

            <div>

                <div class="streak-title">
                    Longest streak
                </div>

                <div class="streak-value">
                    25 days
                </div>

            </div>

        </div>

    </div>

</div>



<div class="analytics-card">

    <div class="analytics-section-title">
        <span>Entertainment Log</span>
    </div>

    <div class="entertainment-card">

        <div class="ent-chart">

            <div class="ent-donut">

                <div class="ent-center">

                    <div class="ent-total">
                        248
                    </div>

                    <div class="ent-label">
                        Total Entries
                    </div>

                </div>

            </div>

        </div>

        <div class="ent-legend">

            <div class="legend-item">
                <div class="legend-left">
                    <span class="legend-dot movies"></span>
                    <span>Movies</span>
                </div>

                <div class="legend-right">
                    <strong>82</strong>
                    <span class="movies-percent">33%</span>
                </div>
            </div>

            <div class="legend-item">
                <div class="legend-left">
                    <span class="legend-dot tv"></span>
                    <span>TV Series</span>
                </div>

                <div class="legend-right">
                    <strong>54</strong>
                    <span class="tv-percent">22%</span>
                </div>
            </div>

            <div class="legend-item">
                <div class="legend-left">
                    <span class="legend-dot books"></span>
                    <span>Books</span>
                </div>

                <div class="legend-right">
                    <strong>44</strong>
                    <span class="books-percent">18%</span>
                </div>
            </div>

            <div class="legend-item">
                <div class="legend-left">
                    <span class="legend-dot anime"></span>
                    <span>Anime</span>
                </div>

                <div class="legend-right">
                    <strong>37</strong>
                    <span class="anime-percent">15%</span>
                </div>
            </div>

            <div class="legend-item">
                <div class="legend-left">
                    <span class="legend-dot reads"></span>
                    <span>Reads</span>
                </div>

                <div class="legend-right">
                    <strong>31</strong>
                    <span class="reads-percent">12%</span>
                </div>
            </div>

        </div>

    </div>

</div>



        <div class="analytics-card analytics-wide">

            <div class="analytics-section-title">
                 Year Overview
            </div>

            <div class="analytics-placeholder">
                Line Graph Here
            </div>

        </div>



        <div class="analytics-card">

           <div class="analytics-label">
                Most Used Planner
            </div>

            <div class="analytics-streak planner-purple">

                <i data-lucide="book-open-check"></i>

                <span>Study Log</span>

            </div>

            <div class="analytics-subtitle">
                Used 22 days this month
            </div>

        </div>



        <div class="analytics-card">

           <div class="analytics-label">
            Planner Age
            </div>

            <div class="analytics-streak planner-green">

                <i data-lucide="calendar-heart"></i>

                <span>124</span>

            </div>

            <div class="analytics-subtitle">
                Days since first use
            </div>

        </div>



        <div class="analytics-card analytics-wide">

            <div class="analytics-section-title">
                Planner Activity
            </div>

            <div class="analytics-placeholder heatmap">
                Heatmap Here
            </div>

        </div>

    </div>

</div>

`;
}
