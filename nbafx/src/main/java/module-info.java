module com.nba {
    requires javafx.controls;
    requires javafx.fxml;

    opens com.nba to javafx.fxml;
    exports com.nba;
}
